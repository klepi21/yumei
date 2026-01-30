'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArtStyle, Dream } from '@/types';
import { Loader2, AlertCircle, Zap } from 'lucide-react';
import { COMIC_STYLES } from '@/lib/constants';

interface DreamInputFormProps {
    onDreamGenerated: (dream: Dream) => void;
}

export default function DreamInputForm({ onDreamGenerated }: DreamInputFormProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [status, setStatus] = useState({ canGenerate: true, remaining: 1, isPro: false });

    const [formData, setFormData] = useState({
        dream: '',
        emotion: '',
        style: 'anime' as ArtStyle
    });

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await fetch('/api/user/status');
                const data = await res.json();
                if (data) setStatus(data);
            } catch (e) {
                console.error("Failed to check status", e);
            }
        };
        checkStatus();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/dream/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                const statusRes = await fetch('/api/user/status');
                const statusData = await statusRes.json();
                if (statusData) setStatus(statusData);
                throw new Error(data.error || 'Failed to interpret dream');
            }

            if (data.warning) {
                alert(`⚠️ ${data.warning}`);
            }

            onDreamGenerated(data);

            const statusRes = await fetch('/api/user/status');
            const statusData = await statusRes.json();
            if (statusData) setStatus(statusData);

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-neutral-800">DREAM PARAMETERS</h2>
                    <p className="text-xs font-mono text-neutral-600 mt-1">
                        Input subjective narrative data for rendering.
                    </p>
                </div>
                {/* STATUS BADGE - NUDE STYLE */}
                <div className={`font-mono text-[10px] px-2 py-1 border rounded font-bold
                    ${status.isPro
                        ? 'bg-[#8fb38e] text-black border-[#658963]'
                        : (session?.user?.credits || 0) > 0
                            ? 'bg-[#8fb38e] text-black border-[#658963]'
                            : 'bg-[#cf9e9e] text-black border-[#a34941]'
                    }`}>
                    {status.isPro
                        ? 'UNLIMITED'
                        : `CREDITS: ${session?.user?.credits || (status.remaining === 1 ? '1 (DAILY)' : '0')}`
                    }
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">

                {/* NARRATIVE INPUT */}
                <div className="space-y-2 flex-1 flex flex-col">
                    <Label htmlFor="dream" className="text-xs font-mono uppercase tracking-widest text-primary">01 // NARRATIVE DATA</Label>
                    <Textarea
                        id="dream"
                        placeholder="I was flying over a neon city..."
                        className="flex-1 min-h-[150px] bg-background border-2 border-border focus:border-primary text-foreground placeholder:text-muted-foreground focus:ring-0 rounded-xl resize-none p-4 text-base font-medium"
                        value={formData.dream}
                        onChange={(e) => setFormData({ ...formData, dream: e.target.value })}
                        required
                        disabled={!status.canGenerate && !loading}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* EMOTION INPUT */}
                    <div className="space-y-2">
                        <Label htmlFor="emotion" className="text-xs font-mono uppercase tracking-widest text-primary">02 // EMOTION</Label>
                        <Input
                            id="emotion"
                            placeholder="e.g. Wonder, Fear"
                            className="bg-background border-2 border-border focus:border-primary h-12 rounded-xl"
                            value={formData.emotion}
                            onChange={(e) => setFormData({ ...formData, emotion: e.target.value })}
                            disabled={!status.canGenerate && !loading}
                        />
                    </div>

                    {/* STYLE SELECTOR */}
                    <div className="space-y-2">
                        <Label htmlFor="style" className="text-xs font-mono uppercase tracking-widest text-primary">03 // RENDER STYLE</Label>
                        <Select
                            value={formData.style}
                            onValueChange={(val) => setFormData({ ...formData, style: val as ArtStyle })}
                            disabled={!status.canGenerate && !loading}
                        >
                            <SelectTrigger className="bg-background border-2 border-border focus:border-primary h-12 rounded-xl">
                                <SelectValue placeholder="Select style" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#e5e5e5] border-2 border-black/10 text-black z-[100] opacity-100 isolate">
                                {COMIC_STYLES.map((style) => (
                                    <SelectItem key={style.id} value={style.id} className="focus:bg-black/10 focus:text-black font-medium">
                                        {style.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {error && (
                    <div className="bg-destructive/10 border border-destructive text-destructive p-3 rounded-lg text-sm font-mono flex gap-2 items-center">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                {!status.canGenerate && !loading && (
                    <div className="bg-[#e3c099] border-none p-3 rounded-lg text-sm font-mono flex gap-2 items-center text-black/80 shadow-sm">
                        <span className="font-bold">DAILY LIMIT REACHED.</span>
                    </div>
                )}

                <div className="pt-2">
                    <Button
                        type="submit"
                        disabled={loading || !status.canGenerate}
                        className={`w-full h-14 rounded-xl text-lg font-black tracking-wider uppercase transition-all
                            ${!status.canGenerate
                                ? 'bg-muted text-muted-foreground border-2 border-transparent'
                                : 'bg-primary text-primary-foreground hover:bg-primary/90 border-b-4 border-black/20 active:border-b-0 active:translate-y-1'
                            }`}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>PROCESSING...</span>
                            </div>
                        ) : !status.canGenerate ? (
                            <span>LOCKED</span>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Zap className="w-5 h-5 fill-current" />
                                <span>INITIATE GENERATION</span>
                            </div>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
