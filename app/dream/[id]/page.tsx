import { Metadata } from 'next';
import dbConnect from '@/lib/db';
import Dream from '@/models/Dream';
import ComicStrip from '@/components/comic-strip';
import ComicInfo from '@/components/comic-info';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Disc } from 'lucide-react';

interface Props {
    params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await (params as any);
    await dbConnect();
    const dream = await Dream.findById(id);

    if (!dream) return { title: 'Dream Not Found | Yumei' };

    const siteUrl = process.env.NEXTAUTH_URL || 'https://yumei-plans.vercel.app';

    return {
        metadataBase: new URL(siteUrl),
        title: `Dream: ${dream.input.slice(0, 50)}... | Yumei`,
        description: dream.interpretedNarrative || 'A comic generated from a dream using Yumei.',
        openGraph: {
            title: 'Yumei - Dream to Comic',
            description: dream.input.slice(0, 100),
            images: [
                {
                    url: dream.comicImageUrl,
                    width: 832,
                    height: 1248,
                    alt: 'Generated Comic Strip',
                }
            ],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Yumei - Dream to Comic',
            description: dream.input.slice(0, 100),
            images: [dream.comicImageUrl],
        },
    };
}

export default async function DreamView({ params }: Props) {
    const { id } = await (params as any);
    await dbConnect();
    const dream = await Dream.findById(id);

    if (!dream) {
        notFound();
    }

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
}
