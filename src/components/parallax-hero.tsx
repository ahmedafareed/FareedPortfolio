'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLocale } from '@/components/locale-provider';

type HeroImage = { id: string; imageUrl: string; description: string; imageHint?: string };

interface ParallaxHeroProps {
    images: HeroImage[];
    tagline?: string;
    featuredTitle?: string;
}

export default function ParallaxHero({ images, tagline = 'AVAILABLE FOR COMMISSIONS', featuredTitle }: ParallaxHeroProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const { dictionary } = useLocale();

    // Pin hero: do not rotate images. Always show the first image.
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [images.length]);

     useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const { clientX, clientY } = event;
            const x = (clientX / window.innerWidth - 0.5) * 2; // -1 to 1
            const y = (clientY / window.innerHeight - 0.5) * 2; // -1 to 1
            setMousePosition({ x, y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const parallaxX = mousePosition.x * -10; // 2% of viewport width -> ~10px
    const parallaxY = mousePosition.y * -10;

    return (
        <section className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden md:h-screen">
            {/* Background Images */}
            {images.map((image, index) => (
                <div
                    key={image.id}
                    className="absolute inset-0 motion-safe-parallax"
                    style={{ 
                        opacity: index === currentImageIndex ? 1 : 0,
                        transform: `translate(${parallaxX}px, ${parallaxY}px) scale(1.05)`,
                        transition: 'transform 0.2s ease-out, opacity 3s ease-in-out'
                    }}
                >
                    <Image
                        src={image.imageUrl}
                        alt={image.imageHint || image.description}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        data-ai-hint={image.imageHint}
                    />
                </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" aria-hidden="true"></div>

            <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-10 text-white sm:pb-12 md:px-16 md:pb-20">
                <p className="mb-4 text-[10px] uppercase tracking-[0.18em] text-white/75 sm:text-xs sm:tracking-[0.22em]">{dictionary.hero.available}</p>
                <h1 className="max-w-4xl font-headline text-[clamp(2.75rem,12vw,5.75rem)] font-medium leading-[0.94]">{dictionary.hero.story}</h1>
                <div className="mt-6 flex flex-col items-start gap-5 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-6">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-white/75 sm:text-sm sm:tracking-[0.18em]">AHMED FAREED - {tagline || 'TRAVEL PHOTOGRAPHER'}</p>
                    {featuredTitle && <p className="max-w-xs border-l border-white/50 pl-3 text-xs text-white/80 sm:pl-4 sm:text-sm"><span className="mb-1 block text-[9px] uppercase tracking-[0.16em] text-white/55 sm:text-[10px] sm:tracking-[0.2em]">{dictionary.hero.featured}</span>{featuredTitle}</p>}
                </div>
            </div>
        </section>
    );
}
