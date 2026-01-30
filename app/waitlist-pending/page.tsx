'use client';

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut, Disc, Terminal, ShieldAlert, Timer } from "lucide-react";
import Link from "next/link";

export default function WaitlistPending() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 font-sans selection:bg-primary selection:text-primary-foreground relative overflow-hidden">

            {/* Background Decal */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[25vw] font-black text-black/[0.03] dark:text-white/[0.03] select-none leading-none -z-10 pointer-events-none">
                LOCKED
            </div>

            <div className="max-w-md w-full relative z-10">
                {/* BRANDING */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border-4 border-black/5 shadow-sm mb-6">
                        <Disc className="w-10 h-10 text-primary opacity-40 animate-spin-slow" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase leading-none text-center">
                        YUMEI<br />
                        <span className="text-muted-foreground/50">SYSTEM // PENDING</span>
                    </h1>
                    <div className="mt-4 flex items-center gap-2 text-xs font-mono text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border">
                        <Timer className="w-3 h-3 animate-pulse" />
                        <span>AUTH.QUEUE.V3.1</span>
                    </div>
                </div>

                {/* STATUS CARD */}
                <div className="bg-card rounded-[2rem] p-8 border-2 border-border shadow-2xl relative group overflow-hidden">
                    {/* Retro Grid Decor */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-5 pointer-events-none" />

                    <div className="relative z-10 space-y-6">
                        <div className="text-center space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-700 text-[10px] font-bold uppercase tracking-widest">
                                <ShieldAlert className="w-3 h-3" />
                                Access Restricted
                            </div>

                            <h2 className="text-2xl font-black uppercase tracking-tight leading-tight">
                                Neural Gateway <br /> Is Currently Saturated
                            </h2>

                            <p className="text-xs font-mono text-muted-foreground leading-relaxed uppercase">
                                Your account is successfully registered, but the YUMEI beta nodes are at capacity. We are admitting users in sequential waves to ensure engine stability.
                            </p>
                        </div>

                        {/* Status Bento Box */}
                        <div className="bg-muted/50 rounded-2xl p-6 border-2 border-border border-dashed flex flex-col items-center gap-2">
                            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Global Queue Status</span>
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className={`w-1.5 h-6 rounded-full ${i <= 3 ? 'bg-primary' : 'bg-muted-foreground/20 italic'}`} />
                                    ))}
                                </div>
                                <span className="font-black text-xl italic text-primary">62% READY</span>
                            </div>
                            <p className="text-[9px] font-mono text-muted-foreground opacity-60">ESTIMATED DEPLOYMENT: 2-4 DAYS</p>
                        </div>

                        <div className="pt-2">
                            <Button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="w-full h-14 rounded-xl bg-background border-2 border-border hover:bg-muted text-foreground font-black tracking-wider uppercase transition-all flex items-center justify-center gap-3"
                            >
                                <LogOut className="w-5 h-5 opacity-50" />
                                ABORT SESSION
                            </Button>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/60 justify-center">
                            <Terminal className="w-3 h-3" />
                            <span>NODE IDENTIFIER: {Math.random().toString(36).substring(7).toUpperCase()}</span>
                        </div>
                    </div>

                    {/* Technical Decal */}
                    <div className="absolute top-0 right-8 w-1 h-12 bg-primary/20" />
                    <div className="absolute top-4 right-0 w-8 h-1 bg-primary/20" />
                </div>

                {/* FOOTER LINKS */}
                <div className="mt-8 flex justify-center gap-6">
                    <Link href="/" className="text-[10px] font-mono font-bold text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors">
                        ← RETURN TO TERMINAL
                    </Link>
                </div>
            </div>
        </div>
    );
}
