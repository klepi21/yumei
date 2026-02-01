'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Loader2, User, Palette, Calendar, ArrowDown, ChevronDown, ChevronUp } from 'lucide-react';

interface Comic {
    _id: string;
    userId: string;
    input: string;
    style: string;
    comicImageUrl: string;
    createdAt: string;
}

export default function OpenWorldPage() {
    const [comics, setComics] = useState<Comic[]>([]);
    const [loading, setLoading] = useState(true);
    const isFetching = useRef(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const fetchComics = async () => {
        if (isFetching.current) return;
        isFetching.current = true;

        try {
            const res = await fetch('/api/dream/public');
            const data = await res.json();
            if (!data.error) {
                setComics(prev => {
                    // Filter out duplicates to avoid React key conflicts
                    const existingIds = new Set(prev.map(c => c._id));
                    const newComics = data.filter((c: Comic) => !existingIds.has(c._id));
                    return [...prev, ...newComics];
                });
            }
        } catch (e) {
            console.error('Failed to fetch public comics', e);
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    };

    useEffect(() => {
        fetchComics();
    }, []);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        // Trigger fetch when user is 200px from the bottom
        if (scrollTop + clientHeight >= scrollHeight - 200 && !loading) {
            setLoading(true);
            fetchComics();
        }
    };

    if (loading && comics.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest animate-pulse">Accessing Global Dream Stream...</p>
            </div>
        );
    }

    return (
        <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="h-full w-full overflow-y-auto snap-y snap-mandatory bg-[#F2EDE9] scrollbar-hide selection:bg-[#A34941] selection:text-white"
        >
            {/* Background Texture Overlay (Paper/Noise) */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />

            {comics.map((comic) => (
                <section
                    key={comic._id}
                    className="h-full w-full snap-start snap-always relative flex flex-col md:flex-row bg-transparent overflow-hidden border-b border-black/5"
                >
                    {/* Main Comic Image (Left) */}
                    <div className="flex-1 h-[65vh] md:h-full relative overflow-hidden flex items-center justify-center p-6 md:p-12">
                        {/* Branding Logo (Floating) */}
                        <div className="absolute top-8 left-8 z-20 flex items-center gap-2 opacity-80">
                            <div className="w-8 h-8 rounded-full bg-[#A34941] flex items-center justify-center text-white font-black text-xs border border-black/10">Y</div>
                            <span className="font-black tracking-tighter text-xl uppercase italic text-black">YUMEI</span>
                        </div>

                        {/* Decorative Kanji (Large Background) */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
                            <span className="text-[40vw] font-black text-black leading-none">夢</span>
                        </div>

                        {comic.comicImageUrl ? (
                            <div className="relative group">
                                {/* Subtle outer frame */}
                                <div className="absolute -inset-4 border border-black/5 rounded-sm opacity-50 pointer-events-none" />
                                <img
                                    src={comic.comicImageUrl}
                                    alt={comic.input}
                                    className="max-h-[80vh] max-w-full object-contain shadow-[0_40px_100px_rgba(0,0,0,0.15)] border-2 border-white transition-transform duration-700 group-hover:scale-[1.01]"
                                />
                                {/* Corner Accents */}
                                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#A34941]" />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#A34941]" />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4 opacity-20">
                                <div className="w-20 h-20 border-2 border-dashed border-black rounded-full flex items-center justify-center animate-spin-slow">
                                    <Loader2 className="w-8 h-8" />
                                </div>
                                <span className="font-mono text-[10px] tracking-[0.3em] uppercase">Transmission Lost</span>
                            </div>
                        )}

                        {/* Mobile Scroll Indicator */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:hidden animate-bounce text-black/30">
                            <ChevronDown className="w-6 h-6" />
                        </div>
                    </div>

                    {/* Info Overlay (Right) */}
                    <div className="w-full md:w-[400px] p-8 md:p-12 flex flex-col justify-between bg-white/40 backdrop-blur-md md:border-l border-black/10 relative z-10">
                        {/* Top Section */}
                        <div className="space-y-12">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-[#A34941] rounded-full animate-pulse" />
                                    <span className="text-[10px] font-mono font-black text-[#A34941] uppercase tracking-[0.2em]">Neural Fragment</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.85] italic line-clamp-6 text-black">
                                    {comic.input}
                                </h2>
                            </div>

                            {/* Meta Grid */}
                            <div className="space-y-8 pt-8 border-t border-black/5">
                                <MetaItem label="Creator" value={`AGENT.${comic.userId.slice(-6).toUpperCase()}`} icon={User} />
                                <MetaItem label="Style Engine" value={comic.style} icon={Palette} />
                                <MetaItem label="Neural Sync" value={new Date(comic.createdAt).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })} icon={Calendar} />
                            </div>
                        </div>

                        {/* Bottom Section */}
                        <div className="mt-12 space-y-6">
                            {/* Technical Barcode Decor */}
                            <div className="flex gap-[1px] h-6 items-end opacity-20">
                                {[...Array(30)].map((_, i) => (
                                    <div key={i} className={`bg-black w-[1px] h-${(i % 3 === 0 ? 'full' : i % 2 === 0 ? '2/3' : '1/2')}`} />
                                ))}
                            </div>

                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between items-center text-[9px] font-mono font-bold text-black/40 tracking-widest uppercase">
                                    <span>SYSTEM.CORE.V2</span>
                                    <span>INSTANT_ACT</span>
                                </div>
                                <div className="h-[2px] w-full bg-black/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#A34941] w-[65%] animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Arrows (Desktop) */}
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 items-center z-50">
                        <button
                            onClick={() => scrollContainerRef.current?.scrollBy({ top: -window.innerHeight, behavior: 'smooth' })}
                            className="w-12 h-12 rounded-full bg-white/90 border border-black/10 flex items-center justify-center hover:bg-white hover:scale-110 shadow-sm transition-all text-black/40 hover:text-[#A34941]"
                        >
                            <ChevronUp className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => scrollContainerRef.current?.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
                            className="w-12 h-12 rounded-full bg-white/90 border border-black/10 flex items-center justify-center hover:bg-white hover:scale-110 shadow-sm transition-all text-black/40 hover:text-[#A34941]"
                        >
                            <ChevronDown className="w-6 h-6" />
                        </button>
                    </div>
                </section>
            ))}
        </div>
    );
}

function MetaItem({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
    return (
        <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-sm bg-black/5 flex items-center justify-center border border-black/5 group-hover:bg-[#A34941]/5 group-hover:border-[#A34941]/20 transition-colors">
                <Icon className="w-5 h-5 opacity-40 group-hover:opacity-80 group-hover:text-[#A34941] transition-all" />
            </div>
            <div className="flex flex-col">
                <span className="text-[9px] font-mono font-bold opacity-40 uppercase tracking-widest leading-none mb-1">{label}</span>
                <span className="text-sm font-black font-mono tracking-tighter uppercase text-black leading-none">{value}</span>
            </div>
        </div>
    );
}
