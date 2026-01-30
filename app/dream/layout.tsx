'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Home, Calendar, Settings, LogOut, Terminal, Cpu, Ghost, Loader2 } from 'lucide-react';
import SubscriptionCard from '@/components/dashboard/subscription-card';

export default function DreamLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        } else if (status === 'authenticated' && !(session?.user as any)?.betaAccess) {
            router.push('/waitlist-pending');
        }
    }, [status, session, router]);

    // Show loading state while checking authentication
    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest animate-pulse">Initializing Neural Bridge...</p>
            </div>
        );
    }

    // Don't render anything if we're unauthorized (the useEffect handles the redirect)
    if (status === 'unauthenticated' || (status === 'authenticated' && !(session?.user as any)?.betaAccess)) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans flex selection:bg-primary selection:text-primary-foreground">
            {/* --- SIDEBAR (Desktop) --- */}
            <aside className="w-72 border-r-2 border-border bg-card p-6 hidden lg:flex flex-col justify-between sticky top-0 h-screen z-50">

                {/* Top Section */}
                <div className="space-y-8">
                    {/* Logo Area */}
                    <div className="flex flex-col gap-1 pb-6 border-b border-border border-dashed">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <Ghost className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter uppercase">YUMEI_OS</span>
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground pl-10">V.2.0.4 // STABLE</span>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-3">
                        <div className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest pl-2 mb-2">Main Sequence</div>
                        <NavItem href="/dream" icon={Cpu} label="INPUT TERMINAL" />
                        <NavItem href="/dream/history" icon={Calendar} label="MEMORY ARCHIVE" />
                        <NavItem href="/dream/settings" icon={Settings} label="SYSTEM CONFIG" />
                    </nav>
                </div>

                {/* Bottom Section */}
                <div className="space-y-6">
                    <SubscriptionCard />

                    <div className="pt-4 border-t border-border">
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="flex items-center gap-3 text-xs font-bold font-mono text-muted-foreground hover:text-destructive transition-colors w-full px-4 py-3 border border-transparent hover:bg-destructive/10 hover:border-destructive/20 rounded-lg group"
                        >
                            <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            DISCONNECT SESSION
                        </button>
                    </div>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 relative overflow-hidden bg-background">
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                <div className="relative z-10 w-full h-full overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

function NavItem({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 group ${isActive
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-card border-transparent hover:bg-muted hover:border-border text-muted-foreground hover:text-foreground'
                }`}
        >
            <Icon className={`w-4 h-4 ${isActive ? 'fill-current' : ''}`} />
            <span className="font-bold text-xs font-mono tracking-wide">{label}</span>
        </Link>
    );
}
