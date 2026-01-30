'use client';

import React from "react";
import Image from "next/image";
import { Sparkles, Zap } from "lucide-react";

export default function DreamShowcase() {
    return (
        <div className="relative w-full py-24 bg-zinc-950 text-white overflow-hidden font-sans">
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-zinc-400">
                        From Subconscious to Storyboard
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                        See how DreamPanel interprets abstract narratives into consistent, high-fidelity comic strips.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    {/* Example 1: Anime Style */}
                    <div className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                        <div className="relative h-full bg-zinc-900 ring-1 ring-white/10 rounded-xl leading-none flex flex-col overflow-hidden">
                            <div className="p-6 border-b border-white/5 bg-white/5 backdrop-blur-sm flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="text-purple-400 w-5 h-5" />
                                    <span className="font-semibold text-zinc-200">Style: Ethereal Anime</span>
                                </div>
                                <span className="text-xs font-mono text-zinc-500 uppercase">Input: "Floating City"</span>
                            </div>
                            <div className="relative aspect-[2/3] w-full">
                                <Image
                                    src="/dream-example-1.jpg"
                                    alt="Anime style dream comic of a floating city"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Example 2: Manga Style */}
                    <div className="group relative md:mt-24">
                        <div className="absolute -inset-1 bg-gradient-to-r from-zinc-500 to-white rounded-2xl blur opacity-20 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                        <div className="relative h-full bg-zinc-900 ring-1 ring-white/10 rounded-xl leading-none flex flex-col overflow-hidden">
                            <div className="p-6 border-b border-white/5 bg-white/5 backdrop-blur-sm flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Zap className="text-yellow-400 w-5 h-5" />
                                    <span className="font-semibold text-zinc-200">Style: B&W Manga</span>
                                </div>
                                <span className="text-xs font-mono text-zinc-500 uppercase">Input: "Space Cat"</span>
                            </div>
                            <div className="relative aspect-[2/3] w-full">
                                <Image
                                    src="/dream-example-2.jpg"
                                    alt="Manga style dream comic of a space cat"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
