import { Dream } from '@/types';
import { Download, Share2 } from 'lucide-react';
import { Button } from './ui/button';

interface ComicInfoProps {
    dream: Dream;
}

export default function ComicInfo({ dream }: ComicInfoProps) {
    // @ts-ignore - sanitizedDream is added dynamically from API
    const sanitizedDream = (dream as any).sanitizedDream;

    const handleSave = async () => {
        if (!dream.comicImageUrl) return;
        try {
            // Use proxy to avoid CORS issues with external usage (Together.ai)
            const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(dream.comicImageUrl)}`;
            const response = await fetch(proxyUrl);

            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `dream-panel-${new Date().getTime()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download image. Please try again.');
        }
    };

    const handleShare = () => {
        const url = `${window.location.origin}/dream/${dream.id || (dream as any)._id}`;
        navigator.clipboard.writeText(url);
        alert('Share link copied to clipboard! 🚀');
    };

    return (
        <div className="bg-white text-black rounded-[2rem] border-2 border-black p-6 shadow-sm space-y-6">

            {/* Status Header */}
            <div className="flex justify-between items-center border-b-2 border-border pb-4">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                    <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-secondary">
                        GENERATION COMPLETE
                    </span>
                </div>
                <span className="text-[10px] font-mono opacity-50">ID: {(dream?.id || (dream as any)._id || 'UNKNOWN').slice(0, 8).toUpperCase()}</span>
            </div>

            {/* Main Title / Sanitized Prompt */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-xs uppercase tracking-widest text-primary font-mono mb-2">01 // SUBJECT SOURCE</h3>
                    <p className="text-lg font-bold leading-tight">
                        "{sanitizedDream || dream.input}"
                    </p>
                </div>

                {/* Original Prompt (if different) */}
                {sanitizedDream && sanitizedDream !== dream.input && (
                    <div className="pt-2">
                        <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1">RAW INPUT</h3>
                        <p className="text-xs text-muted-foreground italic font-mono">
                            "{dream.input}"
                        </p>
                    </div>
                )}
            </div>

            {/* Details Grid (Bento Mini-Tiles) */}
            <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-muted/30 p-3 rounded-xl border border-border">
                    <span className="block text-[10px] uppercase text-muted-foreground font-mono font-bold mb-1">Style</span>
                    <span className="text-sm font-bold capitalize">{dream.style}</span>
                </div>
                <div className="bg-muted/30 p-3 rounded-xl border border-border">
                    <span className="block text-[10px] uppercase text-muted-foreground font-mono font-bold mb-1">Emotion</span>
                    {/* @ts-ignore */}
                    <span className="text-sm font-bold capitalize">{(dream as any).emotion || 'Dynamic'}</span>
                </div>
                <div className="bg-muted/30 p-3 rounded-xl border border-border">
                    <span className="block text-[10px] uppercase text-muted-foreground font-mono font-bold mb-1">Panels</span>
                    <span className="text-sm font-bold">{dream.panelCount || 4}</span>
                </div>
                <div className="bg-muted/30 p-3 rounded-xl border border-border">
                    <span className="block text-[10px] uppercase text-muted-foreground font-mono font-bold mb-1">Date</span>
                    <span className="text-sm font-bold">{new Date(dream.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            {/* Narrative */}
            {dream.interpretedNarrative && (
                <div className="pt-4 border-t-2 border-border border-dashed">
                    <h3 className="text-[10px] uppercase tracking-widest text-primary font-mono mb-2">02 // NARRATIVE INTERPRETATION</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-mono">
                        &gt; {dream.interpretedNarrative}
                    </p>
                </div>
            )}

            <div className="pt-2 flex gap-3">
                <Button onClick={handleSave} className="flex-1 rounded-xl font-bold bg-foreground text-background hover:bg-foreground/90 h-10">
                    <Download className="w-4 h-4 mr-2" /> SAVE
                </Button>
                <Button onClick={handleShare} variant="outline" className="flex-1 rounded-xl font-bold border-2 h-10 hover:bg-muted/50">
                    <Share2 className="w-4 h-4 mr-2" /> SHARE
                </Button>
            </div>
        </div>
    );
}
