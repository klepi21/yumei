'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { ArrowUpRight, BookOpen, Sparkles, Activity, Globe, Disc, Plus } from 'lucide-react';

export default function Home() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({ globalCount: 0, userCount: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        if (data && !data.error) setStats(data);
      } catch (e) {
        console.error("Failed to fetch stats", e);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 font-sans text-foreground selection:bg-primary selection:text-primary-foreground relative">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute bottom-[-5vw] left-4 text-[20vw] font-black text-muted-foreground/5 select-none leading-none opacity-20 truncate">YUMEI</div>
      </div>

      {/* HEADER */}
      <header className="relative z-10 flex justify-between items-center mb-10 px-2 mt-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center border-2 border-black/20 shadow-sm">
            <Disc className="w-6 h-6 animate-spin-slow text-primary-foreground" />
          </div>
          <div>
            <span className="block font-black text-2xl tracking-tighter uppercase leading-none">YUMEI // SYSTEM</span>
            <span className="text-[10px] font-mono text-muted-foreground tracking-widest pl-0.5">DREAM TO COMIC ENGINE</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border">
            <span>SYS.VER.2.0</span>
            <span className="text-secondary font-bold">● ONLINE</span>
          </div>
          {!session && (
            <Link href="/api/auth/signin">
              <Button size="sm" className="bg-foreground text-background font-mono text-xs font-bold uppercase tracking-wider hover:bg-foreground/90 h-9 px-6 rounded-lg">
                Login
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* BENTO GRID */}
      <main className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 auto-rows-[220px]">

        {/* 1. HERO / CREATE CARD (Large, Solid Cyber Red) */}
        <div
          className="md:col-span-2 lg:col-span-2 row-span-2 bg-[#A34941] text-white rounded-[2rem] p-8 flex flex-col justify-between relative overflow-hidden group border-2 border-white/10 shadow-xl"
        >
          {/* No background image per user request */}

          {/* Decorative Kanji/Tech */}
          <div className="absolute top-6 right-6 flex flex-col items-end opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity z-10">
            <span className="text-6xl font-black writing-vertical-rl text-black">夢想</span>
            <span className="text-xs font-mono mt-2 border border-white/40 p-1">TS-26</span>
          </div>

          <div className="space-y-4 relative z-10 mt-4">
            <div className="inline-block px-3 py-1 rounded border border-white/30 bg-black/10 text-xs font-mono font-bold tracking-widest mb-2">
              PROJECT: DREAM
            </div>
            {/* VALUE PROPOSITION UPDATE */}
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85]">
              DREAM<br />TO<br />COMIC
            </h1>
            <p className="font-mono text-sm opacity-80 max-w-sm mt-2">
              Turn your subconscious into manga panels instantly.
            </p>
          </div>

          <div className="flex justify-end mt-auto mb-2 relative z-10">
            <Link href={session ? "/dream" : "/api/auth/signin"} className="w-full sm:w-auto">
              <Button size="lg" className="h-16 rounded-xl bg-black text-white hover:bg-zinc-900 border-2 border-white/10 text-xl font-bold gap-3 pl-8 pr-8 w-full shadow-2xl transition-all hover:scale-105 active:scale-95">
                CREATE COMIC <ArrowUpRight className="w-6 h-6" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 2. JOURNAL / HISTORY (Solid Cyber Orange) */}
        <div
          className="md:col-span-1 row-span-2 bg-[#E0A15E] text-black rounded-[2rem] p-7 flex flex-col relative group border-2 border-black/10 shadow-lg hover:shadow-2xl transition-all overflow-hidden"
        >
          {/* Background Comic Layer */}
          <div className="absolute inset-0 z-0 opacity-10 grayscale group-hover:grayscale-0 group-hover:opacity-30 transition-all duration-700">
            <img
              src="/examples/example2.jpg"
              alt="Comic background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#E0A15E]/80 via-transparent to-[#E0A15E]" />
          </div>

          {/* Decor */}
          <div className="absolute top-4 right-4 w-12 h-12 border-2 border-dashed border-black/20 rounded-full flex items-center justify-center animate-spin-slow z-10">
            <Plus className="w-4 h-4 opacity-50" />
          </div>

          <div className="flex-1 mt-4 relative z-10">
            <div className="w-16 h-16 bg-black/10 rounded-xl flex items-center justify-center mb-6">
              <BookOpen className="w-8 h-8 opacity-80" />
            </div>
            <h2 className="text-4xl font-black tracking-tight leading-none uppercase">Dream<br />Log</h2>
          </div>

          <div className="border-t-2 border-black/10 pt-4 flex justify-between items-end relative z-10">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono font-bold opacity-60 uppercase">Records</span>
              <span className="text-2xl font-bold font-mono">{stats.userCount}</span>
            </div>
            <ArrowUpRight className="w-8 h-8 p-1 bg-black text-white rounded-lg group-hover:rotate-45 transition-transform" />
          </div>

          <Link href="/dream/history" className="absolute inset-0 z-20" />
        </div>

        {/* 3. STATS TILE (Solid Cyber Green) */}
        {/* ... stays solid for contrast ... */}
        <div className="bg-[#658963] text-white p-6 rounded-[2rem] border-2 border-white/10 flex flex-col justify-between hover:scale-[1.02] transition-transform shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 text-9xl font-black opacity-10 text-black z-0">{stats.globalCount}+</div>

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <Activity className="w-8 h-8" />
              <div className="animate-pulse w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)] border border-white/20" />
            </div>
            <h3 className="text-lg font-bold uppercase opacity-80">System Activity</h3>
          </div>

          <div className="relative z-10">
            <div className="text-5xl font-mono font-bold tracking-tighter">98%</div>
            <div className="text-[10px] font-mono uppercase bg-black/20 self-start inline-block px-1 rounded">Optimal</div>
          </div>
        </div>

        {/* 4. MODE TILE (Solid Cyber Grey) */}
        <div className="bg-[#969696] text-black p-6 rounded-[2rem] flex flex-col justify-between border-2 border-black/10 relative overflow-hidden group">
          {/* Background Comic Layer */}
          <div className="absolute inset-0 z-0 opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-700">
            <img
              src="/examples/example3.jpg"
              alt="Comic background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none z-10" />
          {/* Sticker */}
          <div className="absolute top-4 right-4 rotate-12 bg-[#A34941] text-white text-[10px] font-black py-1 px-3 rounded shadow-sm z-20">
            BETA v2
          </div>

          <Globe className="w-10 h-10 opacity-70 mb-auto relative z-20" />

          <div className="relative z-20">
            <h3 className="font-black text-2xl uppercase text-black">Open<br />World</h3>
            <p className="text-xs font-mono mt-1 opacity-70">Join the collective dream stream.</p>
          </div>
        </div>

        {/* 5. FOOTER / INFO TILE (Wide, Technical) */}
        <div className="md:col-span-3 lg:col-span-4 bg-card text-card-foreground rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-border relative overflow-hidden group">

          {/* Background Comic Layer (Rotated) */}
          <div className="absolute -right-20 -bottom-20 w-80 h-120 z-0 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-1000 rotate-12 pointer-events-none">
            <img
              src="/examples/example4.jpg"
              alt="Comic background"
              className="w-full h-full object-cover rounded-3xl shadow-2xl"
            />
          </div>

          {/* Barcode Decor */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-10 hidden md:block">
            <div className="flex items-end gap-[2px] h-8">
              {[...Array(20)].map((_, i) => (
                <div key={i} className={`w-${i % 2 === 0 ? '1' : '2'} h-full bg-foreground`} />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 z-10">
            <Disc className="w-8 h-8 animate-spin-slow text-muted-foreground" />
            <div>
              <p className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground">YUMEI DREAM SYSTEMS © 2026</p>
              <p className="text-[10px] text-muted-foreground/60">POWERED BY TOGETHER.AI FLASH-IMAGE-2.5 // ALL RIGHTS RESERVED</p>
            </div>
          </div>

          <div className="flex gap-6 z-10">
            <Link href="#" className="font-mono text-xs font-bold hover:text-primary transition-colors uppercase">Terms of Service</Link>
            <Link href="#" className="font-mono text-xs font-bold hover:text-primary transition-colors uppercase">Privacy Protocol</Link>
          </div>
        </div>

      </main>
    </div>
  );
}
