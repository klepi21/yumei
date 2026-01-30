'use client';

import Link from 'next/link';
import { Zap, Barcode } from "lucide-react";

export default function SubscriptionCard() {
    return (
        <div className="p-5 rounded-[1.5rem] bg-[#E0A15E] text-black border-2 border-black/10 relative overflow-hidden group flex flex-col justify-between gap-4">

            {/* Header */}
            <div>
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono border border-black/20 px-1.5 py-0.5 rounded-sm uppercase font-bold">CURRENT PLAN</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">FREE<br />TIER</h3>
            </div>

            {/* Simple Stats */}
            <div className="bg-black/10 rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase">DAILY CREDITS</span>
                    <span className="text-sm font-bold font-mono">1/1</span>
                </div>
                <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
                    <div className="h-full bg-black w-full" />
                </div>
            </div>

            {/* Action Button */}
            <Link href="/dream/upgrade" className="w-full">
                <button className="w-full py-3 rounded-xl bg-black text-white hover:bg-zinc-800 transition-all font-bold uppercase tracking-wider text-xs shadow-lg hover:translate-y-[-2px] flex items-center justify-center gap-2">
                    UPGRADE NOW <Zap className="w-4 h-4 fill-white" />
                </button>
            </Link>
        </div>
    );
}
