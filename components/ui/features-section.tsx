'use client';

import React from "react";
import { Database, BrainCircuit, BookOpen, Layers } from "lucide-react";

const FEATURES = [
    {
        title: "Dream Database",
        description: "Never lose a memory again. Build a permanent archive of your subconscious adventures, searchable and visualized forever.",
        icon: Database,
        color: "text-purple-400"
    },
    {
        title: "Kamazias LLM",
        description: "Our proprietary Kamazias model is trained to interpret dream logic. It decodes surreal symbolism into structured comic scripts.",
        icon: BrainCircuit,
        color: "text-blue-400"
    },
    {
        title: "Manga & Webtoon",
        description: "Export in multiple formats. Whether you prefer classic black-and-white manga or vibrant vertical webtoons.",
        icon: BookOpen,
        color: "text-green-400"
    }
];

export default function FeaturesSection() {
    return (
        <section className="relative w-full py-24 bg-zinc-950/50 backdrop-blur-sm border-t border-white/5">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
                        Beyond Just Generation
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        YUMEI isn't just a tool; it's a sanctuary for your imagination. Powered by advanced AI to understand the surreal.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {FEATURES.map((feature, idx) => (
                        <div
                            key={idx}
                            className="group relative p-8 rounded-xl bg-zinc-900 overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]"
                        >
                            {/* Anime Speed Line Effect Background */}
                            <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent scale-150" />

                            {/* Manga Dot Pattern Overlay */}
                            <div
                                className="absolute inset-0 opacity-[0.05]"
                                style={{
                                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                                    backgroundSize: '20px 20px'
                                }}
                            />

                            {/* Corner Accents (Cyber/Tech feel) */}
                            <div className="absolute top-0 right-0 p-3 opacity-50">
                                <div className="w-16 h-16 border-t-2 border-r-2 border-white/10 rounded-tr-xl group-hover:border-purple-500/50 transition-colors" />
                            </div>
                            <div className="absolute bottom-0 left-0 p-3 opacity-50">
                                <div className="w-8 h-8 border-b-2 border-l-2 border-white/10 rounded-bl-xl group-hover:border-purple-500/50 transition-colors" />
                            </div>

                            <div className="relative z-10 space-y-6">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500 ring-1 ring-white/5 group-hover:ring-purple-500/30 ${feature.color}`}>
                                    <feature.icon className="w-7 h-7" />
                                </div>

                                <div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2 font-sans group-hover:text-purple-200 transition-colors">
                                        {feature.title}
                                    </h3>

                                    <p className="text-zinc-400 leading-relaxed text-sm font-medium">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
