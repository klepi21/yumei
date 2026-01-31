import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import Together from 'together-ai';
import User from '@/models/User';
import dbConnect from '@/lib/db';
import Dream from '@/models/Dream';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { COMIC_STYLES } from '@/lib/constants';


const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

// Helper to generate multi-panel comic strip using Together.ai Flash Image 2.5
async function generateComicStrip(
    dreamText: string,
    panelDescriptions: Array<{ visualDescription: string; dialogue: string; panelSize?: string }>,
    style: string,
    emotion: string,
    panelCount: number
): Promise<{ imageUrl: string; prompt: string } | null> {
    try {
        // Build detailed prompt with varied panel layouts
        const panelsText = panelDescriptions.map((panel, i) => {
            const size = panel.panelSize || 'medium';
            return `Panel ${i + 1} (${size}): ${panel.visualDescription}${panel.dialogue ? ` | English dialogue: "${panel.dialogue}"` : ''}`;
        }).join('\n');

        // Lookup detailed style prompt from constants
        const styleInfo = COMIC_STYLES.find(s => s.id === style) || COMIC_STYLES[0];
        const stylePrompt = styleInfo.prompt;

        const comicPrompt = `(Masterpiece, Best Quality, 8k, Ultra-Detailed) Professional comic book page illustration.

STORY CONTEXT:
${dreamText}

PAGE LAYOUT:
${panelCount}-panel comic page with VARIED panel sizes and shapes (Dynamic layout).
- Solid black panel borders with clean white gutters between panels
- Each panel clearly separated and distinct
- Vertical reading flow (top to bottom)

${panelsText}

CHARACTER CONSISTENCY RULES (HIGHEST PRIORITY):
- Same character must look identical across all panels they appear in
- Maintain visual consistency in hair, clothing, and features throughout the page
- Apply comic style to body/pose/action but preserve consistent appearance

TEXT AND LETTERING (CRITICAL):
- All text in speech bubbles must be PERFECTLY CLEAR, LEGIBLE, and correctly spelled in ENGLISH
- Use bold clean comic book lettering, large and easy to read
- Speech bubbles: crisp white fill, solid black outline, pointed tail toward speaker
- Keep dialogue SHORT
- NO blurry, warped, or unreadable text

ART STYLE:
${stylePrompt}
Dimensions: High Resolution
Emotional atmosphere: ${emotion}

COMPOSITION:
- Vary camera angles across panels: close-up, medium shot, wide establishing shot
- Natural visual flow: left-to-right, top-to-bottom reading order
- Dynamic character poses with clear expressive acting
- Detailed backgrounds matching the scene and mood`;

        console.log('🎨 Generating anime comic with varied panels:', comicPrompt);

        const response = await together.images.generate({
            model: 'google/flash-image-2.5',
            prompt: comicPrompt,
            width: 832,
            height: 1248,
        });

        console.log('✅ Together.ai response received');

        if (response.data && response.data.length > 0) {
            // With response_format: 'url', TypeScript knows this is ImageDataURL
            const imageUrl = response.data[0].url;
            return {
                imageUrl,
                prompt: comicPrompt
            };
        }

        console.error('❌ No image data in response');
        return null;
    } catch (error: any) {
        console.error('❌ Comic Generation Exception:', error);

        // Check if it's a content moderation error
        if (error?.error?.error?.message?.includes('content') ||
            error?.error?.error?.message?.includes('moderation') ||
            error?.error?.error?.message?.includes('flagged')) {
            console.error('⚠️ Content was blocked by safety filters');
        }

        return null;
    }
}

import { buildComicPrompt } from '@/lib/prompt-utils';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { dream, style, characterImages = [] } = body;

        if (!dream) return NextResponse.json({ error: 'Dream description is required' }, { status: 400 });

        await dbConnect();

        // RATE LIMIT CHECK
        const user = await User.findOne({ email: session.user.email });
        let usedCredit = false;

        if (user && user.credits > 0) {
            usedCredit = true;
        }
        else if (user && user.lastGenerationDate) {
            const lastGen = new Date(user.lastGenerationDate);
            const today = new Date();
            const isSameDay = lastGen.getDate() === today.getDate() &&
                lastGen.getMonth() === today.getMonth() &&
                lastGen.getFullYear() === today.getFullYear();

            if (isSameDay && !user.isPro) {
                return NextResponse.json({
                    error: 'Daily limit reached. Upgrade to Unlimited or buy credits!',
                    warning: 'You have used your free daily generation.'
                }, { status: 429 });
            }
        }

        let panelCount = 5;
        let sanitizedDream = dream;

        // SAFETY LAYER: Sanitize text
        try {
            const safetyPrompt = `Rewrite the following dream description to be PG-13 and safe for a public comic strip.
            - Remove gore and extreme violence.
            - Replace lethal actions (shooting, stabbing) with non-lethal alternatives (stunners, energy blasts, pushing).
            - Output ONLY the rewritten safe text. Do not add explanations.

            Dream: "${dream}"`;

            const safetyCheck = await together.chat.completions.create({
                messages: [{ role: 'user', content: safetyPrompt }],
                model: 'ServiceNow-AI/Apriel-1.6-15b-Thinker',
            });

            const safeText = safetyCheck.choices[0].message?.content?.trim();
            if (safeText) sanitizedDream = safeText;
        } catch (e) {
            console.warn('⚠️ Sanitization failed:', e);
        }

        const comicPrompt = buildComicPrompt({
            prompt: sanitizedDream,
            style,
            characterImages
        });

        console.log('🎨 Generating comic with prompt:', comicPrompt.substring(0, 100) + '...');

        const comicResponse = await (together.images as any).generate({
            model: 'google/flash-image-2.5',
            prompt: comicPrompt,
            width: 832,
            height: 1248,
            reference_images: characterImages,
        });

        const comicResult = comicResponse.data?.[0] ? {
            imageUrl: comicResponse.data[0].url,
            prompt: comicPrompt
        } : null;

        if (!comicResult) {
            return NextResponse.json({
                error: 'Unable to generate comic. The content may have been flagged by safety filters. Please try a different dream description with less intense or violent imagery.'
            }, { status: 400 });
        }

        // --- NEW: PERSIST TO UPLOADTHING ---
        let persistentImageUrl = comicResult.imageUrl;
        try {
            console.log('☁️ Uploading image to permanent storage (UploadThing)...');
            const { UTApi } = await import('uploadthing/server');
            const utapi = new UTApi();

            // Fetch the image from Together.ai
            const imageRes = await fetch(comicResult.imageUrl);
            const imageBlob = await imageRes.blob();

            // Create a pseudo-file for UploadThing
            const file = new File([imageBlob], `dream-${Date.now()}.png`, { type: 'image/png' });

            const uploadResult = await utapi.uploadFiles(file);

            if (uploadResult.data?.url) {
                persistentImageUrl = uploadResult.data.url;
                console.log('✅ Permanent storage upload successful:', persistentImageUrl);
            } else {
                console.warn('⚠️ UploadThing returned no URL, using temporary URL:', uploadResult.error);
            }
        } catch (uploadError) {
            console.error('❌ Failed to upload to UploadThing:', uploadError);
            // Fallback to the temporary URL (so the user at least sees the result)
        }
        // ------------------------------------

        const narrative = "Direct visual interpretation of the dream";

        // 3. Save to MongoDB
        let newDream;
        try {
            console.log('💾 Saving dream to database for user:', session.user.email);
            newDream = await Dream.create({
                userId: session.user.email || (session.user as any).id,
                input: dream,
                interpretedNarrative: narrative,
                style: style,
                comicImageUrl: persistentImageUrl, // Use the persistent URL
                sanitizedDream: sanitizedDream,
                panelCount: panelCount,
                imagePrompt: comicResult.prompt,
                characterImages: characterImages,
                status: 'completed',
            });
            console.log('✅ Dream saved successfully:', newDream._id);

            // Update User's last generation date
            // Update User's last generation date (Atomic)
            // Update User state (Atomic)
            if (usedCredit) {
                await User.findOneAndUpdate(
                    { email: session.user.email },
                    { $inc: { credits: -1 }, $set: { lastGenerationDate: new Date() } }
                );
                console.log('💎 consumed 1 credit');
            } else {
                await User.findOneAndUpdate(
                    { email: session.user.email },
                    { $set: { lastGenerationDate: new Date() } }
                );
            }
            console.log('🕒 atomic update of lastGenerationDate complete');

        } catch (dbError) {
            console.error('❌ Database Save Failed:', dbError);
            // Don't crash the request, return the result anyway so the user gets their image
            // but return an error warning
            return NextResponse.json({
                imageUrl: comicResult.imageUrl,
                prompt: comicResult.prompt,
                sanitizedDream: sanitizedDream,
                warning: 'Image generated but failed to save to history.'
            });
        }

        // Return both original and sanitized dream
        return NextResponse.json({
            ...newDream.toObject(),
            sanitizedDream: sanitizedDream
        });

    } catch (error) {
        console.error("❌ Dream Generation Error:", error);
        return NextResponse.json({ error: 'Failed to process dream' }, { status: 500 });
    }
}
