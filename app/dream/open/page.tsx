'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Loader2, User, Palette, Calendar, ChevronDown, ChevronUp, ArrowRight, ArrowLeft, Disc } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Comic {
    _id: string;
    userId: string;
    input: string;
    style: string;
    comicImageUrl: string;
    imageUrl?: string; // Support for legacy field
    createdAt: string;
}

export default function OpenWorldPage() {
    const [comics, setComics] = useState<Comic[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [initialLoad, setInitialLoad] = useState(true);
    const isFetching = useRef(false);

    const fetchComics = useCallback(async () => {
        if (isFetching.current) return;
        isFetching.current = true;

        try {
            const res = await fetch('/api/dream/public');
            const data = await res.json();
            if (!data.error) {
                setComics(prev => {
                    const existingIds = new Set(prev.map(c => c._id.toString()));
                    const newComics = data.filter((c: Comic) => !existingIds.has(c._id.toString()));
                    return [...prev, ...newComics];
                });
            }
        } catch (e) {
            console.error('Failed to fetch public comics', e);
        } finally {
            setLoading(false);
            setInitialLoad(false);
            isFetching.current = false;
        }
    }, []);

    useEffect(() => {
        fetchComics();
    }, [fetchComics]);

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') handlePrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [comics, activeIndex]);

    const handleNext = () => {
        if (activeIndex < comics.length - 1) {
            setActiveIndex(prev => prev + 1);
        }
        // Prefetch when near end
        if (activeIndex > comics.length - 3) {
            fetchComics();
        }
    };

    const handlePrev = () => {
        if (activeIndex > 0) {
            setActiveIndex(prev => prev - 1);
        }
    };

    if (initialLoad) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-[#F2EDE9]">
                <div className="w-16 h-16 bg-[#A34941] rounded-2xl flex items-center justify-center mb-6 shadow-xl animate-bounce">
                    <Disc className="w-10 h-10 text-white animate-spin-slow" />
                </div>
                <p className="text-xs font-mono text-[#A34941] uppercase tracking-[0.4em] font-black animate-pulse">Syncing Global Nerve Stream</p>
                <div className="mt-8 w-48 h-[2px] bg-black/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#A34941] w-1/3 animate-[progress_2s_infinite]" />
                </div>
            </div>
        );
    }

    const currentComic = comics[activeIndex];

    if (!currentComic) return null;

    const displayUrl = currentComic.comicImageUrl || currentComic.imageUrl;

    return (
        <div className="h-full w-full bg-[#F2EDE9] relative overflow-hidden flex flex-col md:flex-row selection:bg-[#A34941] selection:text-white">
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />

            {/* Main Comic Display (Left) */}
            <div className="flex-1 relative z-10 flex items-center justify-center p-4 md:p-12 overflow-hidden border-b md:border-b-0 md:border-r border-black/10">
                {/* Branding Logo */}
                <div className="absolute top-8 left-8 flex items-center gap-3 opacity-60">
                    <div className="w-8 h-8 rounded-full bg-[#A34941] flex items-center justify-center text-white font-black text-xs">Y</div>
                    <span className="font-black tracking-tighter text-xl uppercase italic text-black">YUMEI</span>
                </div>

                {/* Background Kanji Decor */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none overflow-hidden">
                    <span className="text-[50vw] font-black text-black leading-none transform translate-y-10">夢</span>
                </div>

                {/* IMAGE CONTAINER - GUARANTEED VISIBILITY */}
                <div className="relative w-full h-full flex items-center justify-center max-h-[85vh]">
                    {displayUrl ? (
                        <div className="relative group animate-in fade-in zoom-in duration-500">
                            {/* Frame Effects */}
                            <div className="absolute -inset-4 border-2 border-dashed border-[#A34941]/10 rounded-lg pointer-events-none" />

                            <img
                                src={displayUrl}
                                alt={currentComic.input}
                                className="max-h-[80vh] max-w-full object-contain shadow-[0_50px_100px_rgba(0,0,0,0.2)] border-8 border-white relative z-10"
                                key={currentComic._id} // Force re-render on image change
                            />

                            {/* Red Corner Accents */}
                            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-[#A34941] z-20" />
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-[#A34941] z-20" />
                        </div>
                    ) : (
                        <div className="space-y-4 opacity-10 flex flex-col items-center">
                            <Loader2 className="w-20 h-20 animate-spin" />
                            <span className="font-mono text-sm tracking-widest uppercase font-black">Transfer Blocked</span>
                        </div>
                    )}
                </div>

                {/* Progress Indicator (Bottom) */}
                <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-mono font-black text-black opacity-30 uppercase tracking-[0.2em]">Neural Buffer</span>
                        <div className="flex gap-2">
                            {comics.slice(0, 10).map((_, i) => (
                                <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === (activeIndex % 10) ? 'w-8 bg-[#A34941]' : 'w-2 bg-black/10'}`} />
                            ))}
                        </div>
                    </div>
                    <span className="font-mono text-xs font-black opacity-40">#{activeIndex + 1} / {comics.length}</span>
                </div>
            </div>

            {/* Info Panel (Right) */}
            <div className="w-full md:w-[450px] bg-white/40 backdrop-blur-xl p-8 md:p-14 flex flex-col justify-between relative z-20 border-t md:border-t-0 border-black/10">
                <div className="space-y-12">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#A34941] rounded-full animate-pulse" />
                            <span className="text-[11px] font-mono font-black text-[#A34941] uppercase tracking-[0.3em]">Synapse Fragment</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-black italic uppercase leading-[0.85] tracking-tighter break-words line-clamp-[8]">
                            {currentComic.input}
                        </h2>
                    </div>

                    <div className="space-y-10 pt-10 border-t-2 border-black/5 border-dashed">
                        <MetaItem label="Creator" value={`AGENT.${currentComic.userId.slice(-6).toUpperCase()}`} icon={User} />
                        <MetaItem label="Style Engine" value={currentComic.style} icon={Palette} />
                        <MetaItem label="Neural Sync" value={new Date(currentComic.createdAt).toLocaleDateString(undefined, { month: 'long', day: '2-digit', year: 'numeric' })} icon={Calendar} />
                    </div>
                </div>

                {/* Overhauled Navigation Controls */}
                <div className="mt-12 space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            disabled={activeIndex === 0}
                            onClick={handlePrev}
                            className="bg-white border-2 border-black h-16 rounded-2xl font-black italic uppercase text-lg hover:bg-black hover:text-white transition-all active:scale-95 disabled:opacity-20 flex items-center gap-3"
                        >
                            <ArrowLeft className="w-6 h-6" /> PREV
                        </Button>
                        <Button
                            onClick={handleNext}
                            className="bg-[#A34941] text-white border-2 border-black h-16 rounded-2xl font-black italic uppercase text-lg hover:bg-[#8e3a33] transition-all active:scale-95 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center gap-3"
                        >
                            NEXT <ArrowRight className="w-6 h-6" />
                        </Button>
                    </div>

                    {/* Technical Status */}
                    <div className="pt-6 flex flex-col gap-2 opacity-30">
                        <div className="flex justify-between font-mono text-[9px] font-black uppercase tracking-[0.2em] text-black">
                            <span>OS_YUMEI_VERSION_2.0</span>
                            <span>ACTIVE_STREAM</span>
                        </div>
                        <div className="h-[3px] w-full bg-black/5 rounded-full overflow-hidden">
                            <div className="h-full bg-black w-[85%] animate-[pulse_3s_infinite]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetaItem({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
    return (
        <div className="flex items-center gap-5 group">
            <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center text-white border-2 border-black group-hover:bg-[#A34941] group-hover:border-[#A34941] transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.1)] group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:shadow-[6px_6px_0px_rgba(0,0,0,0.1)]">
                <Icon className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-mono font-black opacity-30 uppercase tracking-[0.2em] leading-none mb-1.5">{label}</span>
                <span className="text-base font-black font-mono tracking-tight uppercase text-black leading-none">{value}</span>
            </div>
        </div>
    );
}
