import { Metadata } from 'next';
import dbConnect from '@/lib/db';
import Dream from '@/models/Dream';
import ComicStrip from '@/components/comic-strip';
import ComicInfo from '@/components/comic-info';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Disc } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const resolvedParams = await params;
        const id = resolvedParams?.id;

        if (!id) return { title: 'Invalid Dream | Yumei' };

        await dbConnect();
        const dream = await Dream.findById(id);

        if (!dream) return { title: 'Dream Not Found | Yumei' };

        const siteUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://yumei-plans.vercel.app');

        // Ensure siteUrl has protocol for URL constructor
        const safeSiteUrl = siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`;

        return {
            metadataBase: new URL(safeSiteUrl),
            title: `Dream: ${dream.input.slice(0, 50)}... | Yumei`,
            description: dream.interpretedNarrative || 'A comic generated from a dream using Yumei.',
            openGraph: {
                title: 'YUMEI - Dream to Comic',
                description: dream.input.slice(0, 100),
                url: `${safeSiteUrl}/dream/${id}`,
                siteName: 'Yumei Dream System',
                images: [
                    {
                        url: dream.comicImageUrl,
                        width: 832,
                        height: 1248,
                        alt: 'Generated Comic Strip',
                        type: 'image/png'
                    }
                ],
                type: 'article',
            },
            twitter: {
                card: 'summary_large_image',
                title: 'YUMEI - Dream to Comic',
                description: dream.input.slice(0, 100),
                images: [dream.comicImageUrl],
            },
        };
    } catch (error) {
        console.error('Metadata generation failed:', error);
        return { title: 'Yumei - Dream Viewer' };
    }
}

export default async function DreamView({ params }: Props) {
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id) notFound();

    await dbConnect();
    const dream = await Dream.findById(id);

    if (!dream) {
        notFound();
    }

    try {
        // Sanitize for the client component
        const sanitizedDreamData = JSON.parse(JSON.stringify(dream));
        // Add an id field for consistency with previous types
        sanitizedDreamData.id = sanitizedDreamData._id;

        return (
            <div className="min-h-screen bg-background p-4 md:p-8 font-sans transition-colors duration-500">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <header className="flex justify-between items-center mb-8 px-4">
                        <Link href="/dream" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center border-2 border-black/20 shadow-sm group-hover:scale-110 transition-transform">
                                <ArrowLeft className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <div>
                                <span className="block font-black text-xl tracking-tighter uppercase leading-none">BACK TO TERMINAL</span>
                            </div>
                        </Link>

                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-black/5 rounded-full flex items-center justify-center border border-black/10">
                                <Disc className="w-4 h-4 animate-spin-slow opacity-40" />
                            </div>
                            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">DREAM.VIEWER.PRO.V2</span>
                        </div>
                    </header>

                    <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Column: The Comic */}
                        <div className="lg:col-span-8 flex flex-col gap-6">
                            <ComicStrip dream={sanitizedDreamData} />
                        </div>

                        {/* Right Column: Metadata & Narrative */}
                        <div className="lg:col-span-4 sticky top-8">
                            <ComicInfo dream={sanitizedDreamData} />
                        </div>
                    </main>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Dream render failed:', error);
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center border-4 border-black border-double">
                <div className="max-w-md space-y-6">
                    <Disc className="w-16 h-16 mx-auto animate-spin-slow opacity-20" />
                    <h1 className="text-4xl font-black uppercase tracking-tighter">System Error</h1>
                    <p className="font-mono text-sm opacity-60 bg-black/5 p-4 rounded border border-dashed border-black/20">
                        Unable to stabilize the dream sequence. A rendering exception occurred on the server.
                    </p>
                    <Link href="/dream">
                        <Button className="mt-8 bg-black text-white hover:bg-zinc-800 font-bold uppercase tracking-widest border-2 border-white/10 px-8 py-6 rounded-none">
                            Return to Terminal
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }
}
