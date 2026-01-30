'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Disc, ShieldCheck, Terminal, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 font-sans selection:bg-primary selection:text-primary-foreground relative overflow-hidden">
            {/* Background Decal */}
            {/* Background Decal */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-black text-black/[0.03] dark:text-white/[0.03] select-none leading-none -z-10 pointer-events-none">
                ACCESS
            </div>

            <div className="max-w-md w-full relative z-10">
                {/* BRANDING */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center border-4 border-black/20 shadow-xl mb-6 animate-pulse">
                        <Disc className="w-10 h-10 text-primary-foreground animate-spin-slow" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase leading-none text-center">
                        YUMEI<br />
                        <span className="text-primary">SYSTEM // ACCESS</span>
                    </h1>
                    <div className="mt-4 flex items-center gap-2 text-xs font-mono text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border">
                        <Terminal className="w-3 h-3" />
                        <span>AUTH.REQUIRED.V2.0</span>
                    </div>
                </div>

                {/* SIGN IN CARD */}
                <div className="bg-card rounded-[2rem] p-8 border-2 border-border shadow-2xl relative group overflow-hidden">
                    {/* Retro Grid Decor */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-5 pointer-events-none" />

                    <div className="relative z-10 space-y-6">
                        <div className="text-center space-y-2">
                            <h2 className="text-xl font-bold uppercase tracking-tight">Initialize Protocol</h2>
                            <p className="text-xs font-mono text-muted-foreground leading-relaxed uppercase">
                                Authentication is required to access the dream-to-comic neural engine.
                            </p>
                        </div>

                        <div className="pt-4">
                            <Button
                                onClick={() => signIn('google', { callbackUrl: '/dream' })}
                                className="w-full h-16 rounded-xl bg-[#A34941] hover:bg-[#8f3f38] text-white border-b-4 border-black/30 active:border-b-0 active:translate-y-1 text-xl font-black tracking-wider uppercase transition-all flex items-center justify-center gap-4 group"
                            >
                                <img
                                    src="https://www.google.com/favicon.ico"
                                    alt="Google"
                                    className="w-6 h-6 bg-white rounded-full p-1"
                                />
                                SIGN IN WITH GOOGLE
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/60 justify-center">
                            <ShieldCheck className="w-3 h-3" />
                            <span>SECURE ENCRYPTED BRIDGE</span>
                        </div>
                    </div>

                    {/* Technical Decal */}
                    <div className="absolute top-0 right-8 w-1 h-12 bg-primary/20" />
                    <div className="absolute top-4 right-0 w-8 h-1 bg-primary/20" />
                </div>

                {/* FOOTER LINKS */}
                <div className="mt-8 flex justify-center gap-6">
                    <Link href="/" className="text-[10px] font-mono font-bold text-muted-foreground hover:text-primary uppercase tracking-widest">
                        ← Back to Terminal
                    </Link>
                </div>
            </div>
        </div>
    );
}
