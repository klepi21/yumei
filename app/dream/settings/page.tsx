'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { User, CreditCard, Bell, Shield, Smartphone, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SettingsPage() {
    const { data: session } = useSession();

    return (
        <div className="container mx-auto px-4 md:px-8 py-8 max-w-6xl">
            <div className="flex flex-col gap-1 mb-8">
                <h1 className="text-4xl font-black text-foreground uppercase tracking-tighter">SYSTEM CONFIG</h1>
                <p className="text-xs font-mono text-muted-foreground uppercase">USER PROFILE // PREFERENCES // SECURITY</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto">

                {/* 1. PROFILE CARD (Solid Cyber Red) */}
                <div className="md:col-span-2 bg-[#A34941] text-white rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-20 font-black text-8xl leading-none pointer-events-none">ID</div>

                    <div className="w-24 h-24 rounded-2xl bg-black/20 border-2 border-white/20 flex items-center justify-center overflow-hidden shrink-0 relative z-10">
                        {session?.user?.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-10 h-10 text-white/50" />
                        )}
                    </div>

                    <div className="flex-1 text-center md:text-left relative z-10">
                        <h2 className="text-3xl font-black uppercase tracking-tight">{session?.user?.name || 'DREAMER'}</h2>
                        <p className="text-sm font-mono opacity-80 mb-2">{session?.user?.email}</p>
                        <span className="inline-block px-3 py-1 rounded-sm bg-black text-white text-[10px] font-bold uppercase tracking-widest border border-white/20">
                            {session?.user?.credits && session.user.credits > 0 ? 'CORE NEURAL AGENT' : 'TRIAL AGENT'}
                        </span>
                    </div>

                    <div className="flex flex-col gap-2 w-full md:w-auto relative z-10">
                        <div className="flex justify-between items-center bg-black/10 p-3 rounded-lg border border-white/10">
                            <span className="text-[10px] font-mono font-bold opacity-70 uppercase mr-4">Display Name</span>
                            <span className="text-xs font-bold">{session?.user?.name?.split(' ')[0] || 'User'}</span>
                        </div>
                    </div>
                </div>

                {/* 2. BILLING / CREDITS (Solid Cyber Orange) */}
                <div className="bg-[#E0A15E] text-black rounded-[2rem] p-8 flex flex-col justify-between relative overflow-hidden shadow-lg group">
                    <div className="absolute top-4 right-4 animate-pulse w-3 h-3 bg-[#A34941] rounded-full" />

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <CreditCard className="w-5 h-5" />
                            <h3 className="font-black text-lg uppercase">NEURAL CREDITS</h3>
                        </div>
                        <div className="text-4xl font-black mb-1">PACKS</div>
                        <p className="text-xs font-mono font-bold opacity-60 uppercase">Instant Activation</p>
                    </div>

                    <div className="mt-8">
                        <div className="flex justify-between text-[10px] font-mono font-bold opacity-60 uppercase mb-1">
                            <span>Available Balance</span>
                            <span>{session?.user?.credits || 0} CORE</span>
                        </div>
                        <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden mb-4">
                            <div className="h-full bg-black w-2/3" />
                        </div>
                        <Link href="/dream/upgrade">
                            <Button className="w-full bg-black text-white hover:bg-zinc-800 border-none font-bold rounded-xl h-12">
                                BUY CREDITS <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* 3. SETTINGS TOGGLES (Solid Cyber Grey) */}
                <div className="md:col-span-3 bg-[#969696] text-black rounded-[2rem] p-8 shadow-lg border-2 border-black/10">
                    <h3 className="font-black text-xl uppercase tracking-wide mb-6 flex items-center gap-2">
                        GLOBAL PREFERENCES
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <SettingToggle icon={Bell} title="NOTIFICATIONS" description="System alerts." />
                        <SettingToggle icon={Shield} title="PRIVACY MODE" description="Hide from feed." />
                        <SettingToggle icon={Smartphone} title="HAPTICS" description="Vibration on." active />
                    </div>
                </div>
            </div>
        </div>
    );
}

function SettingToggle({ icon: Icon, title, description, active = false }: { icon: any, title: string, description: string, active?: boolean }) {
    return (
        <div className="flex items-center gap-4 p-4 bg-black/5 rounded-2xl border border-black/5 hover:bg-black/10 transition-colors cursor-pointer group">
            <div className={`p-3 rounded-xl ${active ? 'bg-[#A34941] text-white' : 'bg-black/10 text-black/50'}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <div className="flex justify-between items-center gap-2">
                    <h4 className="font-black text-sm uppercase">{title}</h4>
                    {active && <div className="w-2 h-2 bg-[#658963] rounded-full" />}
                </div>
                <p className="text-xs opacity-60 font-mono">{description}</p>
            </div>
        </div>
    );
}
