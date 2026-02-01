'use client';

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, ArrowUpRight } from "lucide-react";
import { Dream } from '@/types';
import ComicInfo from '@/components/comic-info';
import Image from 'next/image';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarView() {
    const [dreams, setDreams] = useState<Dream[]>([]);
    const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch history
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch('/api/dream/history');
                const data = await res.json();
                if (data.dreams) {
                    setDreams(data.dreams);
                }
            } catch (error) {
                console.error("Failed to load history:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const getDreamForDay = (dayIndex: number) => {
        return dreams[dayIndex] || null;
    };

    return (
        <div className="rounded-2xl bg-black/5 p-4 border border-black/5">

            {/* Calendar Controls (Minimal) */}
            <div className="flex justify-between items-center mb-4 opacity-50">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest">January 2026</span>
                <div className="flex gap-1">
                    <ChevronLeft className="w-3 h-3" />
                    <ChevronRight className="w-3 h-3" />
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-1">
                {DAYS.map(day => (
                    <div key={day} className="text-center text-[8px] font-bold opacity-40 uppercase">
                        {day[0]}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {loading ? (
                    <div className="col-span-7 flex items-center justify-center text-[10px] py-4 font-mono opacity-50">
                        [LOADING_DATA]
                    </div>
                ) : (
                    Array.from({ length: 28 }).map((_, i) => {
                        const dream = getDreamForDay(i);
                        return (
                            <div
                                key={i}
                                onClick={() => dream && setSelectedDream(dream)}
                                className={`
                                    aspect-square rounded-sm flex items-center justify-center relative group transition-all duration-200
                                    ${dream
                                        ? 'bg-black/20 hover:bg-black/40 cursor-pointer border border-black/10'
                                        : 'bg-transparent border border-black/5 opacity-30'
                                    }
                                `}
                            >
                                {dream && (
                                    <div className="w-1 h-1 bg-current rounded-full animate-pulse" />
                                )}
                                <span className={`absolute top-0.5 left-1 text-[8px] font-mono leading-none ${dream ? 'opacity-100' : 'opacity-50'}`}>
                                    {i + 1}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Detail Modal (Bento Style) */}
            {selectedDream && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
                    onClick={() => setSelectedDream(null)}
                >
                    <div
                        className="bg-background border-2 border-primary rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl relative cursor-default"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Technical Label */}
                        <div className="absolute top-0 left-0 bg-primary text-primary-foreground px-4 py-1 text-xs font-mono font-bold rounded-br-xl z-20">
                            ARCHIVE RECORD #{selectedDream._id?.toString().slice(-4).toUpperCase() || 'UNKNOWN'}
                        </div>

                        <button
                            onClick={() => setSelectedDream(null)}
                            className="absolute top-4 right-4 p-2 bg-muted hover:bg-destructive hover:text-white rounded-full transition-colors z-20 group"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="w-full md:w-1/2 bg-muted/20 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-border">
                            {selectedDream.comicImageUrl && (
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                                    <Image
                                        src={selectedDream.comicImageUrl}
                                        alt="Dream Comic"
                                        width={400}
                                        height={600}
                                        className="rounded-lg shadow-xl border-2 border-border w-full h-auto object-contain relative"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
                            <ComicInfo dream={selectedDream} />

                            <div className="mt-8 pt-8 border-t border-dashed border-border flex justify-between items-center text-xs font-mono text-muted-foreground">
                                <span>DATE: {new Date(selectedDream.createdAt!).toLocaleDateString()}</span>
                                <span className="text-primary">VERIFIED</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
