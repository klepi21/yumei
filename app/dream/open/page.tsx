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
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const fetchComics = async () => {
        try {
            const res = await fetch('/api/dream/public');
            const data = await res.json();
            if (!data.error) {
                setComics(prev => [...prev, ...data]);
            }
        } catch (e) {
            console.error('Failed to fetch public comics', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComics();
    }, []);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 100 && !loading) {
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
            className="h-full w-full overflow-y-auto snap-y snap-mandatory bg-black scrollbar-hide"
        >
            {comics.map((comic) => (
                <section
                    key={comic._id}
                    className="h-full w-full snap-start snap-always relative flex flex-col md:flex-row bg-[#F7F3F0] overflow-hidden border-b-2 border-black/10"
                >
                    {/* Main Comic Image (Left) */}
                    <div className="flex-1 h-[70vh] md:h-full relative overflow-hidden bg-white/50 flex items-center justify-center p-4">
                        {comic.comicImageUrl ? (
                            <img
                                src={comic.comicImageUrl}
                                alt={comic.input}
                                className="max-h-full max-w-full object-contain shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-black/5"
                            />
                        ) : (
                            <div className="text-muted-foreground font-mono text-xs uppercase italic opacity-20">Transmission Lost</div>
                        )}

                        {/* Scroll Indicator (Mobile) */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:hidden animate-bounce text-black/20">
                            <ChevronDown className="w-8 h-8" />
                        </div>
                    </div>

                    {/* Info Overlay (Right) */}
                    <div className="w-full md:w-96 p-8 flex flex-col justify-between bg-white/30 backdrop-blur-sm md:border-l-2 md:border-black/5">
                        <div className="space-y-8">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-mono font-bold text-[#A34941] uppercase tracking-widest">NEURAL FRAGMENT</span>
                                <h2 className="text-2xl font-black uppercase tracking-tighter leading-none italic truncate block">"{comic.input}"</h2>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center border border-black/5">
                                        <User className="w-5 h-5 opacity-40" />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-mono opacity-50 uppercase font-medium">CREATOR</span>
                                        <span className="text-sm font-bold font-mono tracking-tight uppercase">USER.{comic.userId.slice(-6)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center border border-black/5">
                                        <Palette className="w-5 h-5 opacity-40" />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-mono opacity-50 uppercase font-medium">STYLE ENGINE</span>
                                        <span className="text-sm font-bold font-mono tracking-tight uppercase">{comic.style}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center border border-black/5">
                                        <Calendar className="w-5 h-5 opacity-40" />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-mono opacity-50 uppercase font-medium">TIMESTAMP</span>
                                        <span className="text-sm font-bold font-mono tracking-tight uppercase">
                                            {new Date(comic.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-black/5 flex flex-col gap-4">
                            <div className="flex items-center justify-between opacity-30 font-mono text-[10px] font-bold uppercase tracking-widest">
                                <span>SYSTEM VERSION</span>
                                <span>YV.2.0.4</span>
                            </div>
                            <div className="h-1 bg-black/5 rounded-full overflow-hidden">
                                <div className="h-full bg-[#A34941] w-1/3 animate-pulse" />
                            </div>
                        </div>
                    </div>

                    {/* Navigation Controls (Desktop Sidebar Style) */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 items-center z-50">
                        <button
                            onClick={() => scrollContainerRef.current?.scrollBy({ top: -window.innerHeight, behavior: 'smooth' })}
                            className="w-10 h-10 rounded-full bg-white/80 border border-black/10 flex items-center justify-center hover:bg-white hover:scale-110 transition-all text-black/40 hover:text-black"
                        >
                            <ChevronUp className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => scrollContainerRef.current?.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
                            className="w-10 h-10 rounded-full bg-white/80 border border-black/10 flex items-center justify-center hover:bg-white hover:scale-110 transition-all text-black/40 hover:text-black"
                        >
                            <ChevronDown className="w-6 h-6" />
                        </button>
                    </div>
                </section>
            ))}
        </div>
    );
}
