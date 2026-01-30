'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming this utility exists, if not I'll just use class string

const IMAGES = [
    // example1.png was likely the screenshot of the stats card to be deleted
    { src: '/examples/example2.jpg', alt: 'Comic Example 2' },
    { src: '/examples/example3.jpg', alt: 'Comic Example 3' },
    { src: '/examples/example4.jpg', alt: 'Comic Example 4' },
];

export default function ComicCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // Auto-rotate
    useEffect(() => {
        if (isLightboxOpen) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
        }, 3500); // 3.5 seconds

        return () => clearInterval(interval);
    }, [isLightboxOpen]);

    const handleNext = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    };

    const handlePrev = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);
    };

    return (
        <>
            {/* Small Card view in Hero */}
            <div
                className="relative w-full aspect-[4/5] sm:aspect-square md:aspect-[4/5] lg:aspect-square rounded-3xl overflow-hidden cursor-pointer group shadow-2xl"
                onClick={() => setIsLightboxOpen(true)}
            >
                {/* Images with transition */}
                {IMAGES.map((img, index) => (
                    <div
                        key={img.src}
                        className={cn(
                            "absolute inset-0 transition-opacity duration-1000 ease-in-out p-4 flex items-center justify-center", // Added p-4 and flex centring
                            index === currentIndex
                                ? "opacity-100 z-10"
                                : "opacity-0 z-0"
                        )}
                    >
                        <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            className="object-contain" // Changed to contain to prevent cropping
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />
                    </div>
                ))}

                {/* Overlay Text/UI on hover */}
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex justify-between items-center">
                    <span className="text-white text-sm font-medium">Click to expand</span>
                    <ZoomIn className="text-white w-5 h-5" />
                </div>

                {/* Progress Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                    {IMAGES.map((_, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "h-1 rounded-full transition-all duration-300",
                                idx === currentIndex ? "bg-white w-6" : "bg-white/30 w-1.5"
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* Lightbox Overlay */}
            {isLightboxOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setIsLightboxOpen(false)}
                >
                    <button
                        onClick={() => setIsLightboxOpen(false)}
                        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors z-[60]"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <button
                        onClick={handlePrev}
                        className="absolute left-4 p-3 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors z-[60] hidden sm:block"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>

                    <button
                        onClick={handleNext}
                        className="absolute right-4 p-3 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors z-[60] hidden sm:block"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>

                    <div
                        className="relative w-full h-[85vh] flex items-center justify-center pointer-events-none" // Changed height/layout
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={IMAGES[currentIndex].src}
                            alt={IMAGES[currentIndex].alt}
                            fill
                            className="object-contain"
                            quality={100}
                        />
                    </div>

                    {/* Caption / Counter */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium tracking-widest uppercase">
                        {currentIndex + 1} / {IMAGES.length}
                    </div>
                </div>
            )}
        </>
    );
}

// Simple internal cn utility if lib/utils isn't standard, though it likely is in this shadcn-like repo.
// I'll trust it exists or replace if error.
