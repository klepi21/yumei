import { Dream } from '@/types';
import Image from 'next/image';

interface ComicStripProps {
    dream: Dream;
}

export default function ComicStrip({ dream }: ComicStripProps) {
    // Support both new single-image format and legacy multi-panel format
    const isLegacyFormat = dream.panels && dream.panels.length > 0 && !dream.comicImageUrl;

    return (
        <div className="w-full animate-in fade-in duration-700">
            {/* Comic Image Container */}
            <div className="w-full flex justify-center">
                {!isLegacyFormat && dream.comicImageUrl && (
                    <div className="relative group w-full">
                        {/* Main comic container */}
                        <div className="relative bg-card rounded-xl border border-border p-2 shadow-sm">
                            {/* The Comic Image */}
                            <div className="relative w-full rounded-lg overflow-hidden border-2 border-black">
                                <Image
                                    src={dream.comicImageUrl}
                                    alt={`Multi-panel comic: ${dream.input}`}
                                    width={832}
                                    height={1248}
                                    className="w-full h-auto"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Legacy Grid Fallback */}
                {isLegacyFormat && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-card border border-border relative w-full">
                        {dream.panels.map((panel, index) => (
                            <div key={index.toString()} className="relative aspect-square bg-muted rounded-lg overflow-hidden border border-border">
                                {/* Legacy panels rendering would go here if needed, but we focus on image mainly */}
                                {panel.imageUrl && <Image src={panel.imageUrl} alt={`Panel ${index}`} fill className="object-cover" />}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
