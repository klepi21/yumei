'use client';

import { signIn } from "next-auth/react";
import React from "react";
import Image from "next/image";
import {
    ArrowRight,
    Play,
    Star,
    // Brand Icons
    CheckCircle2,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ComicCarousel from "@/components/ui/comic-carousel";

// --- MOCK BRANDS ---
// --- MOCK BRANDS REMOVED ---

// --- SUB-COMPONENTS ---
// StatItem removed as it is no longer used

// --- MAIN COMPONENT ---
export default function HeroSection() {
    // State removed for direct Google Sign In


    return (
        <div className="relative w-full min-h-screen bg-zinc-950 text-white overflow-hidden font-sans selection:bg-purple-500/30">
            {/* 
        SCOPED ANIMATIONS 
      */}
            <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-fade-in {
          animation: fadeSlideIn 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-marquee {
          animation: marquee 40s linear infinite; /* Slower for readability */
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style>

            {/* Background Image with Gradient Mask */}
            {/* Used a dreamy abstract background relevant to the theme */}
            <div
                className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center opacity-40"
                style={{
                    maskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
                    WebkitMaskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
                }}
            />

            <div className="relative z-10 mx-auto max-w-7xl px-4 pt-10 pb-12 sm:px-6 md:pt-16 md:pb-20 lg:px-8">

                {/* Header / Logo Section */}
                <div className="flex justify-between items-center mb-12 animate-fade-in">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        {/* Custom SVG Logo - Japanese Torii Style */}
                        <div className="relative w-12 h-12 flex items-center justify-center">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                                {/* Torii Gate Structure */}
                                <path d="M8 12C8 12 12 10 24 10C36 10 40 12 40 12" stroke="url(#paint0_linear)" strokeWidth="3" strokeLinecap="round" />
                                <path d="M12 18H36" stroke="url(#paint0_linear)" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M16 10V38" stroke="url(#paint0_linear)" strokeWidth="3" strokeLinecap="round" />
                                <path d="M32 10V38" stroke="url(#paint0_linear)" strokeWidth="3" strokeLinecap="round" />

                                {/* Rising Sun / Moon Detail behind */}
                                <circle cx="24" cy="24" r="6" fill="white" fillOpacity="0.1" />

                                <defs>
                                    <linearGradient id="paint0_linear" x1="8" y1="10" x2="40" y2="38" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#A855F7" />
                                        <stop offset="1" stopColor="#F472B6" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>

                        <div className="flex flex-col leading-none">
                            <span className="text-3xl font-black tracking-tighter text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-400">
                                YUMEI
                            </span>
                            <span className="text-[10px] font-medium tracking-[0.3em] text-purple-400 group-hover:text-purple-300 transition-colors">
                                夢映
                            </span>
                        </div>
                    </div>

                    {/* Beta Badge Removed */}
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-start">

                    {/* --- LEFT COLUMN --- */}
                    <div className="lg:col-span-7 flex flex-col justify-center space-y-8 pt-4">

                        {/* Badge */}
                        <div className="animate-fade-in delay-100">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md transition-colors hover:bg-white/10">
                                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                                    AI-Powered Creativity
                                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                </span>
                            </div>
                        </div>

                        {/* Heading */}
                        <h1
                            className="animate-fade-in delay-200 text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-medium tracking-tighter leading-[0.9]"
                            style={{
                                maskImage: "linear-gradient(180deg, black 0%, black 80%, transparent 100%)",
                                WebkitMaskImage: "linear-gradient(180deg, black 0%, black 80%, transparent 100%)"
                            }}
                        >
                            Turn Dreams Into<br />
                            <span className="bg-gradient-to-br from-purple-300 via-white to-[#ffcd75] bg-clip-text text-transparent">
                                Anime Comics
                            </span><br />
                            Every Morning
                        </h1>

                        {/* Description */}
                        <p className="animate-fade-in delay-300 max-w-xl text-lg text-zinc-400 leading-relaxed">
                            Capture the magic of your subconscious. Structure your narratives with <strong>Kamazias LLM</strong>, generate stunning panels, and store them in your personal <strong>Dream Database</strong>.
                        </p>

                        {/* CTA / Google Sign In */}
                        <div className="animate-fade-in delay-400 max-w-md w-full relative">
                            <Button
                                onClick={() => signIn('google', { callbackUrl: '/dream' })}
                                className="w-full h-14 rounded-full px-8 bg-white text-zinc-950 font-bold hover:bg-zinc-200 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 text-lg"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Sign in with Google
                            </Button>
                            <p className="text-zinc-500 text-xs mt-4 ml-4">
                                Join 2,000+ dreamers waiting for early access.
                            </p>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN --- */}
                    <div className="lg:col-span-5 space-y-6 lg:mt-12">

                        {/* Comic Carousel */}
                        <div className="animate-fade-in delay-500">
                            <ComicCarousel />
                        </div>

                        {/* Marquee Card Removed */}

                    </div>
                </div>
            </div>
        </div>
    );
}
