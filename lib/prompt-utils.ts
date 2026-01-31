import { COMIC_STYLES } from "./constants";

export function buildComicPrompt({
    prompt,
    style,
    characterImages = [],
    isContinuation = false,
    previousContext = "",
    isAddPage = false,
    previousPages = [],
}: {
    prompt: string;
    style?: string;
    characterImages?: string[];
    isContinuation?: boolean;
    previousContext?: string;
    isAddPage?: boolean;
    previousPages?: Array<{
        prompt: string;
    }>;
}): string {
    const styleInfo = COMIC_STYLES.find((s) => s.id === style);
    const styleDesc = styleInfo?.prompt || COMIC_STYLES[2].prompt;

    let continuationContext = "";
    if (isContinuation && previousContext) {
        continuationContext = `\nCONTINUATION CONTEXT:\nThis is a continuation of an existing story. The previous page showed: ${previousContext}\nMaintain visual consistency with the previous panels. Continue the narrative naturally.\n`;
    }

    if (isAddPage && previousPages.length > 0) {
        const storyHistory = previousPages
            .map((page, index) => `Page ${index + 1}: ${page.prompt}`)
            .join("\n");

        continuationContext = `\nSTORY CONTINUATION CONTEXT:\nThis is a continuation of an existing comic story. Here are the previous pages:\n${storyHistory}\n\nThe new page should naturally continue this story. Maintain the same characters, setting, and narrative style. Reference previous events and build upon them.\n`;
    }

    let characterSection = "";
    if (characterImages.length > 0) {
        if (characterImages.length === 1) {
            characterSection = `
CRITICAL FACE CONSISTENCY (IMAGE REFERENCE 1):
- THE PROTAGONIST'S FACE MUST BE 100% IDENTICAL TO REFERENCE IMAGE 1
- USE THE ATTACHED REFERENCE IMAGE 1 AS THE SOURCE FOR ALL FACIAL FEATURES
- MAINTAIN EXACT EYES, NOSE, HAIR, AND FACIAL STRUCTURE FROM REFERENCE 1
- APPLY THE ${style} STYLE TO EVERYTHING ELSE, BUT KEEP THE FACE PERFECTLY CONSISTENT`;
        } else if (characterImages.length === 2) {
            characterSection = `
CRITICAL DUAL CHARACTER FACE CONSISTENCY:
- CHARACTER 1: MUST MATCH REFERENCE IMAGE 1 EXACTLY
- CHARACTER 2: MUST MATCH REFERENCE IMAGE 2 EXACTLY
- DO NOT MIX UP THE CHARACTERS: Character 1 (from Image 1) and Character 2 (from Image 2) must remain distinct and consistent in all panels
- APPLY THE ${style} STYLE WHILE PRESERVING THE SOURCE FACES FROM THE TWO ATTACHED IMAGES`;
        }
    }

    const systemPrompt = `Professional comic book page illustration.
${continuationContext}
${characterSection}

CHARACTER CONSISTENCY RULES (HIGHEST PRIORITY):
- If reference images are provided, the characters' FACES must be 100% identical to the reference images
- Never change hair color, eye color, facial structure, or distinctive features
- Apply comic style to body/pose/action but preserve exact facial appearance
- Same character must look identical across all panels they appear in

TEXT AND LETTERING (CRITICAL):
- All text in speech bubbles must be PERFECTLY CLEAR, LEGIBLE, and correctly spelled
- Use bold clean comic book lettering, large and easy to read
- Speech bubbles: crisp white fill, solid black outline, pointed tail toward speaker
- Keep dialogue SHORT: maximum 1-2 sentences per bubble
- NO blurry, warped, or unreadable text

PAGE LAYOUT:
5-panel comic page arranged as:
[Panel 1] [Panel 2] — top row, 2 equal panels
[    Panel 3      ] — middle row, 1 large cinematic hero panel
[Panel 4] [Panel 5] — bottom row, 2 equal panels
- Solid black panel borders with clean white gutters between panels
- Each panel clearly separated and distinct

ART STYLE:
${styleDesc}
${characterSection}

COMPOSITION:
- Vary camera angles across panels: close-up, medium shot, wide establishing shot
- Natural visual flow: left-to-right, top-to-bottom reading order
- Dynamic character poses with clear expressive acting
- Detailed backgrounds matching the scene and mood`;

    return `${systemPrompt}\n\nSTORY:\n${prompt}`;
}
