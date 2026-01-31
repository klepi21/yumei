'use client';

import React from 'react';
import { Check, Zap, Crown, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function UpgradePage() {
    return (
        <div className="container mx-auto px-4 md:px-8 py-8 max-w-7xl">
            <div className="flex flex-col items-center text-center mb-12">
                <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#A34941] mb-2 px-3 py-1 border border-[#A34941]/30 rounded-full bg-[#A34941]/10">
                    System Upgrade
                </div>
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
                    CHOOSE YOUR<br />REALITY
                </h1>
                <p className="text-muted-foreground max-w-xl text-lg">
                    Unlock higher cognitive functions and expanded memory banks for your dream sequences.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* 1. PULSE PACK (Small) */}
                <div className="bg-[#969696] text-black rounded-[2rem] p-8 flex flex-col relative group border-2 border-black/10 hover:scale-[1.02] transition-transform">
                    <div className="mb-6">
                        <h3 className="font-black text-2xl uppercase italic">PULSE PACK</h3>
                        <div className="flex items-baseline gap-1 mt-2">
                            <span className="text-4xl font-black">$9</span>
                            <span className="text-sm font-bold opacity-60">one-time</span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4 mb-8">
                        <FeatureItem text="50 AI Generations" />
                        <FeatureItem text="Permanent Library Access" />
                        <FeatureItem text="Instant Result Delivery" />
                    </div>

                    <Button className="w-full bg-black text-white hover:bg-zinc-900 border-none font-bold rounded-xl h-12 uppercase">
                        Buy Now
                    </Button>
                </div>

                {/* 2. SYNAPSE PACK (Medium - Highlighted) */}
                <div className="bg-[#E0A15E] text-black rounded-[2rem] p-8 flex flex-col relative group border-2 border-black/10 shadow-xl scale-105 z-10">
                    <div className="absolute top-4 right-4 bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Most Popular
                    </div>

                    <div className="mb-6">
                        <h3 className="font-black text-2xl uppercase italic">SYNAPSE PACK</h3>
                        <div className="flex items-baseline gap-1 mt-2">
                            <span className="text-4xl font-black">$29</span>
                            <span className="text-sm font-bold opacity-60">one-time</span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4 mb-8">
                        <FeatureItem text="200 AI Generations" />
                        <FeatureItem text="Permanent Library Access" />
                        <FeatureItem text="Instant Result Delivery" />
                    </div>

                    <Link href="#" className="w-full">
                        <Button className="w-full bg-black text-white hover:bg-zinc-900 border-none font-bold rounded-xl h-14 uppercase text-lg shadow-lg">
                            Get Pack <Zap className="w-5 h-5 ml-2 fill-white" />
                        </Button>
                    </Link>
                </div>

                {/* 3. NEURAL ENGINE (Large - Red) */}
                <div className="bg-[#A34941] text-white rounded-[2rem] p-8 flex flex-col relative group border-2 border-white/10 hover:scale-[1.02] transition-transform">
                    <div className="mb-6">
                        <h3 className="font-black text-2xl uppercase italic text-black">NEURAL ENGINE</h3>
                        <div className="flex items-baseline gap-1 mt-2">
                            <span className="text-4xl font-black">$59</span>
                            <span className="text-sm font-bold opacity-80">one-time</span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4 mb-8">
                        <FeatureItem text="500 AI Generations" />
                        <FeatureItem text="Permanent Library Access" />
                        <FeatureItem text="Instant Result Delivery" />
                    </div>

                    <Link href="#" className="w-full">
                        <Button className="w-full bg-white text-black hover:bg-gray-200 border-none font-bold rounded-xl h-12 uppercase">
                            Go Pro <Crown className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="mt-16 text-center">
                <p className="text-muted-foreground text-sm font-mono">
                    SECURED BY LEMON SQUEEZY // INSTANT NEURAL ACTIVATION
                </p>
            </div>
        </div>
    );
}

function FeatureItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" />
            </div>
            <span className="font-bold text-sm tracking-tight">{text}</span>
        </div>
    )
}
