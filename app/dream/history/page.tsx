'use client';

import React from 'react';
import { Search, Filter, BookOpen, X, ChevronRight, Grid as GridIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ComicInfo from '@/components/comic-info';
import Image from 'next/image';

export default function JournalPage() {
    const [dreams, setDreams] = React.useState<any[]>([]); // Using any for speed, ideally typed
    const [loading, setLoading] = React.useState(true);
    const [selectedDream, setSelectedDream] = React.useState<any | null>(null);

    React.useEffect(() => {
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

    return (
        <div className="container mx-auto px-4 md:px-8 py-8 max-w-[1600px] min-h-screen">

            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-border pb-6 gap-6">
                <div>
                    <h1 className="text-4xl font-black text-foreground uppercase tracking-tighter mb-2">COMIC<br />ARCHIVE</h1>
                    <p className="text-xs font-mono text-muted-foreground">SUB-ROUTINE: STORAGE // TOTAL RECORDS: {dreams.length}</p>
                </div>

                {/* Search Bar (Styled) */}
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative group w-full md:w-64">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="SEARCH DATABASE..."
                            className="w-full bg-card border-2 border-border text-foreground text-xs font-mono py-3 pl-10 pr-4 rounded-lg focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/50 uppercase"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="aspect-[2/3] bg-muted/20 animate-pulse rounded-xl border border-border" />
                    ))}
                </div>
            ) : dreams.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-3xl opacity-50">
                    <BookOpen className="w-12 h-12 mb-4 text-muted-foreground" />
                    <p className="font-mono text-sm text-muted-foreground">LIBRARY EMPTY</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {dreams.map((dream, idx) => (
                        <div
                            key={idx}
                            onClick={() => setSelectedDream(dream)}
                            className="group relative bg-card rounded-xl border-2 border-border overflow-hidden cursor-pointer hover:border-primary transition-all duration-300 flex flex-col"
                        >
                            {/* Image Thumbnail */}
                            <div className="aspect-[3/4] bg-muted relative overflow-hidden">
                                {dream.comicImageUrl ? (
                                    <Image
                                        src={dream.comicImageUrl}
                                        alt="Thumbnail"
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-muted-foreground text-xs font-mono">
                                        [NO VISUAL DATA]
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">ACCESS</span>
                                </div>
                            </div>

                            {/* Card Info */}
                            <div className="p-3 border-t border-border bg-card relative z-10">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground font-mono">{new Date(dream.createdAt).toLocaleDateString()}</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                </div>
                                <h3 className="text-sm font-bold leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                                    "{dream.sanitizedDream || dream.input}"
                                </h3>
                                <div className="flex gap-2">
                                    <span className="text-[10px] px-1.5 py-0.5 rounded border border-border text-muted-foreground uppercase font-mono">{dream.style}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Detail Modal (Bento) */}
            {selectedDream && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white border-2 border-black rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative text-black">

                        {/* Modal Header Bar */}
                        <div className="absolute top-0 left-0 w-full h-10 bg-primary/10 border-b border-primary/20 flex items-center justify-between px-4 z-20 pointer-events-none md:hidden">
                            <span className="text-[10px] font-mono text-primary font-bold">RECORD VIEW</span>
                        </div>

                        <button
                            onClick={() => setSelectedDream(null)}
                            className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-muted hover:bg-destructive hover:text-white rounded-full transition-colors z-30 pointer-events-auto"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Image Side */}
                        <div className="w-full md:w-3/5 bg-muted/20 flex items-center justify-center p-6 md:p-12 border-b md:border-b-0 md:border-r border-border overflow-y-auto">
                            {selectedDream.comicImageUrl ? (
                                <Image
                                    src={selectedDream.comicImageUrl}
                                    alt="Dream Comic"
                                    width={600}
                                    height={900}
                                    className="rounded-lg shadow-2xl border-2 border-border max-w-full h-auto object-contain"
                                />
                            ) : (
                                <div className="bg-card w-full aspect-[2/3] rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                                    NO IMAGE RENDERED
                                </div>
                            )}
                        </div>

                        {/* Info Side */}
                        <div className="w-full md:w-2/5 p-6 md:p-10 bg-white overflow-y-auto max-h-[50vh] md:max-h-full">
                            <ComicInfo dream={selectedDream} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
