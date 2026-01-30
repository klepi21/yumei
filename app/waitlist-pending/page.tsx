"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function WaitlistPending() {
    return (
        <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-4 text-center">
            <div className="max-w-md w-full bg-zinc-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">⏳</span>
                </div>

                <h1 className="text-3xl font-black text-white mb-2 tracking-tight">You're on the list!</h1>
                <p className="text-zinc-400 text-lg mb-8">
                    We are currently in private beta. We are sending out invites every few days. Watch your inbox!
                </p>

                <div className="p-4 bg-white/5 rounded-xl border border-white/5 mb-8">
                    <p className="text-sm text-zinc-500">Status</p>
                    <div className="flex items-center justify-center gap-2 mt-1">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                        <span className="font-bold text-white">Pending Approval</span>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full text-zinc-500 hover:text-white hover:bg-white/5"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                </Button>
            </div>
            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
        </div>
    );
}
