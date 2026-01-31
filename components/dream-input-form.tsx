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
import { Loader2, AlertCircle, Zap, Upload, X, CheckCircle2 } from 'lucide-react';
import { COMIC_STYLES } from '@/lib/constants';
import { UploadButton } from "../lib/uploadthing";

interface DreamInputFormProps {
    onDreamGenerated: (dream: Dream) => void;
}

export default function DreamInputForm({ onDreamGenerated }: DreamInputFormProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('INITIALIZING ENGINE...');

    const LOADING_MESSAGES = [
        'ANALYZING SCRIPT...',
        'SANITIZING PROMPT...',
        'DRAFTING COMIC LAYOUT...',
        'SYNTHESIZING PANEL 1: ESTABLISHING...',
        'SYNTHESIZING PANEL 2: CONFLICT...',
        'SYNTHESIZING PANEL 3: IMPACT...',
        'INKING TEXTURES & LIGHTING...',
        'FINALIZING SEQUENTIAL ART...',
        'DECODING IMAGE STREAM...'
    ];
    const [error, setError] = useState('');
    const [status, setStatus] = useState({ canGenerate: true, remaining: 1, isPro: false });

    const [formData, setFormData] = useState({
        dream: '',
        style: 'american-modern' as ArtStyle,
        characterImages: [] as string[]
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
        setLoadingMessage(LOADING_MESSAGES[0]);
        setError('');

        // Cycle through messages while generating
        let messageIndex = 0;
        const interval = setInterval(() => {
            messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
            setLoadingMessage(LOADING_MESSAGES[messageIndex]);
        }, 3500);

        try {
            const res = await fetch('/api/dream/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            clearInterval(interval);

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
                    <h2 className="text-xl font-black uppercase tracking-tight text-neutral-800">COMIC PARAMETERS</h2>
                    <p className="text-xs font-mono text-neutral-600 mt-1">
                        Input subjective narrative data and character references.
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
                    <Label htmlFor="dream" className="text-xs font-mono uppercase tracking-widest text-primary">01 // SCRIPT DATA</Label>
                    <Textarea
                        id="dream"
                        placeholder="A cyberpunk detective walks into a smoke-filled bar..."
                        className="flex-1 min-h-[120px] bg-background border-2 border-border focus:border-primary text-foreground placeholder:text-muted-foreground focus:ring-0 rounded-xl resize-none p-4 text-base font-medium"
                        value={formData.dream}
                        onChange={(e) => setFormData({ ...formData, dream: e.target.value })}
                        required
                        disabled={!status.canGenerate && !loading}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* CHARACTER UPLOAD */}
                    <div className="space-y-2">
                        <Label className="text-xs font-mono uppercase tracking-widest text-primary flex items-center gap-2">
                            02 // CHARACTER REF <span className="text-[10px] opacity-50 lowercase font-normal">(OPTIONAL, MAX 2)</span>
                        </Label>
                        <div className="flex gap-2">
                            {formData.characterImages.length < 2 && (
                                <UploadButton
                                    endpoint="imageUploader"
                                    onClientUploadComplete={(res: any) => {
                                        if (res?.[0]) {
                                            setFormData(prev => ({
                                                ...prev,
                                                characterImages: [...prev.characterImages, (res[0] as any).url]
                                            }));
                                        }
                                    }}
                                    onUploadError={(error: Error) => {
                                        setError(`Upload failed: ${error.message}`);
                                    }}
                                    appearance={{
                                        button: "ut-ready:bg-background ut-ready:border-2 ut-ready:border-border ut-ready:text-foreground ut-ready:h-12 ut-ready:rounded-xl ut-ready:w-12 ut-ready:p-0 ut-ready:flex ut-ready:items-center ut-ready:justify-center hover:ut-ready:bg-muted font-mono text-[10px]",
                                        allowedContent: "hidden"
                                    }}
                                    content={{
                                        button: <Upload className="w-5 h-5" />
                                    }}
                                />
                            )}
                            <div className="flex gap-2 flex-1">
                                {formData.characterImages.map((img, i) => (
                                    <div key={i} className="relative w-12 h-12 rounded-xl group overflow-hidden border-2 border-primary/20">
                                        <img src={img} alt={`Character ${i + 1}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                characterImages: prev.characterImages.filter((_, idx) => idx !== i)
                                            }))}
                                            className="absolute inset-0 bg-destructive/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                        >
                                            <X className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                ))}
                                {formData.characterImages.length === 0 && (
                                    <div className="flex-1 h-12 border-2 border-border border-dashed rounded-xl flex items-center justify-center px-3">
                                        <span className="text-[10px] font-mono text-muted-foreground uppercase opacity-40">No characters uploaded</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* STYLE SELECTOR */}
                    <div className="space-y-2">
                        <Label htmlFor="style" className="text-xs font-mono uppercase tracking-widest text-primary">03 // RENDER STYLE</Label>
                        <Select
                            value={formData.style}
                            onValueChange={(val) => setFormData({ ...formData, style: val as ArtStyle })}
                            disabled={!status.canGenerate && !loading}
                        >
                            <SelectTrigger className="bg-background border-2 border-border focus:border-primary h-12 rounded-xl w-full max-w-[200px]">
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

                <div className="pt-4 pb-4">
                    <Button
                        type="submit"
                        disabled={loading || !status.canGenerate}
                        className={`w-full h-16 rounded-xl text-xl font-black tracking-widest uppercase transition-all shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-1
                            ${!status.canGenerate
                                ? 'bg-muted text-muted-foreground border-2 border-transparent cursor-not-allowed opacity-50'
                                : 'bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-black/20'
                            }`}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>{loadingMessage}</span>
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
