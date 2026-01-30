'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import DreamInputForm from '@/components/dream-input-form';
import ComicStrip from '@/components/comic-strip';
import ComicInfo from '@/components/comic-info';
import { Dream } from '@/types';
import CalendarView from '@/components/dashboard/calendar-view';
import { Disc, ChevronLeft, Terminal, Cpu } from 'lucide-react';
import Link from 'next/link';

export default function DreamPage() {
    const { data: session } = useSession();
    const [dreamResult, setDreamResult] = useState<Dream | null>(null);

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 font-sans text-foreground selection:bg-primary selection:text-primary-foreground">

            {/* TECHNICAL HEADER */}
            <header className="flex justify-between items-center mb-8 px-2 border-b border-border pb-4">
                <div className="flex items-center gap-4">
                    <Link href="/" className="hover:text-primary transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all">
                            <ChevronLeft className="w-6 h-6" />
                        </div>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter">DREAM // STUDIO</h1>
                        <p className="text-xs font-mono text-muted-foreground">USER: {session?.user?.name?.toUpperCase() || 'GUEST'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono border border-primary/20 bg-primary/5 px-3 py-1 rounded-full text-primary animate-pulse">
                    <Terminal className="w-3 h-3" />
                    <span>SYSTEM READY</span>
                </div>
            </header>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* MAIN CONTENT AREA */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {!dreamResult ? (
                        /* INPUT FORM CARD */
                        <div className="bg-[#d4d4d4] text-black rounded-[2rem] p-1 border-2 border-black/10 shadow-sm relative group overflow-hidden">
                            {/* Decorative Decals */}
                            <div className="absolute top-0 left-8 w-20 h-2 bg-primary/20 rounded-b-lg border-x border-b border-primary/30 z-0" />
                            <div className="absolute top-6 right-6 flex flex-col items-end opacity-20 pointer-events-none">
                                <span className="text-4xl font-black writing-vertical-rl text-foreground">夢</span>
                                <span className="text-[10px] font-mono mt-1 border border-foreground/30 px-1">INPUT-01</span>
                            </div>

                            <div className="bg-black/5 rounded-[1.8rem] p-6 md:p-10 border border-black/10 h-full relative z-10">
                                <div className="flex items-center justify-between mb-6 opacity-70">
                                    <div className="flex items-center gap-2">
                                        <Cpu className="w-5 h-5 text-[#A34941]" />
                                        <span className="font-mono text-xs tracking-widest uppercase font-bold text-black">INPUT SEQUENCE</span>
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        <div className="w-2 h-2 rounded-full bg-secondary opacity-50" />
                                        <div className="w-2 h-2 rounded-full bg-accent opacity-50" />
                                    </div>
                                </div>
                                <DreamInputForm onDreamGenerated={setDreamResult} />
                            </div>
                        </div>
                    ) : (
                        /* RESULT DISPLAY */
                        <div className="bg-card rounded-[2rem] overflow-hidden border-2 border-border shadow-lg">
                            <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
                                <button
                                    onClick={() => setDreamResult(null)}
                                    className="text-xs font-mono flex items-center gap-2 hover:text-primary transition-colors"
                                >
                                    ← RESET SEQUENCE
                                </button>
                                <span className="text-xs font-mono text-primary">RENDER COMPLETE</span>
                            </div>
                            <div className="p-1">
                                <ComicStrip dream={dreamResult} />
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT: SIDE DISHES (Widgets) */}
                <div className="lg:col-span-4 flex flex-col gap-4">

                    {dreamResult ? (
                        /* RESULT INFO WIDGETS */
                        <ComicInfo dream={dreamResult} />
                    ) : (
                        <>
                            {/* DATE WIDGET (Archive -> Cyber Orange) */}
                            <div className="bg-[#E0A15E] text-black rounded-3xl p-6 border-2 border-black/10 relative overflow-hidden shadow-lg group">
                                <span className="absolute top-4 right-4 text-[10px] font-mono opacity-50 border border-black px-1 rounded">CAL.V1</span>
                                <h3 className="font-black text-lg mb-4 uppercase">Archive<br />Access</h3>
                                <div className="bg-black/10 rounded-2xl p-2 border border-black/5">
                                    <CalendarView />
                                </div>
                            </div>

                            {/* TIP WIDGET (Recall Boost -> Cyber Green) */}
                            <div className="bg-[#658963] text-white rounded-3xl p-6 border-2 border-white/10 flex flex-col gap-2 relative group hover:scale-[1.02] transition-transform shadow-lg overflow-hidden">
                                <div className="absolute -right-4 -bottom-4 text-8xl font-black opacity-10 text-black z-0">04</div>

                                <div className="absolute -right-2 top-6 bg-[#A34941] text-white text-[10px] font-black py-1 px-3 shadow-sm rotate-3 z-10">
                                    TIP #04
                                </div>
                                <h4 className="font-black text-xl relative z-10">RECALL<br />BOOST</h4>
                                <p className="text-sm opacity-90 font-mono leading-relaxed mt-2 relative z-10">
                                    Writing down your dream immediately upon waking increases recall detail by 60%.
                                </p>
                            </div>

                            {/* DECORATIVE WIDGET (Waiting -> Cyber Red/Solid) */}
                            <div className="bg-[#A34941] text-white rounded-3xl p-6 border-2 border-white/10 flex items-center justify-center shadow-lg opacity-80">
                                <div className="text-center">
                                    <Disc className="w-8 h-8 mx-auto mb-2 animate-spin-slow text-black/50" />
                                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-black/70">System Standby...</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
