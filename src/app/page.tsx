'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import ParallaxHero from '@/components/parallax-hero';
import StatsSection from '@/components/stats-section';
import { cn } from '@/lib/utils';

const credentials = [
    { name: 'NATIONAL GEOGRAPHIC', year: '2024' },
    { name: 'VOGUE ITALIA', year: '2023' },
    { name: 'NEW YORK TIMES', year: '2022' },
    { name: 'SONY WORLD PHOTOGRAPHY', year: '2021' },
];

const personalityWords = ['OBSERVER', 'MINIMALIST', 'STORYTELLER'];

export default function Home() {
    const [scrollPercentage, setScrollPercentage] = useState(0);
    const [localTime, setLocalTime] = useState('');

    const heroImages = PlaceHolderImages.filter(p => p.id.startsWith("portfolio-landscape-")).slice(0, 3);
    const rhythmGalleryImages = PlaceHolderImages.filter(p => p.id.startsWith("portfolio-")).slice(3, 8);
    const contactImage = PlaceHolderImages.find(p => p.id === 'award-4');

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            setScrollPercentage(scrolled);
        };

        window.addEventListener('scroll', handleScroll);
        
        // Set local time
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLocalTime(timeString);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    return (
        <div className="bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
            {/* PROGRESS THREAD */}
            <div className="fixed right-5 top-0 h-full w-px bg-border/50 z-50">
                <div className="absolute top-0 left-0 h-full w-full bg-primary transition-transform duration-150 ease-linear" style={{ transform: `scaleY(${scrollPercentage / 100})`, transformOrigin: 'top' }} />
            </div>
            
            {/* SECTION 1: INTRODUCTION */}
            <ParallaxHero images={heroImages} />

            {/* SECTION 3: THE WORK */}
            <section className="w-full py-24 px-4 md:px-8 space-y-32">
                {rhythmGalleryImages.length > 0 && (
                    <>
                        {/* Large Image */}
                        <div className="w-full h-auto">
                            <Image src={rhythmGalleryImages[0].imageUrl} alt={rhythmGalleryImages[0].description} width={1600} height={900} className="w-full h-full object-cover" data-ai-hint={rhythmGalleryImages[0].imageHint} />
                        </div>

                        {/* Two small images */}
                        {rhythmGalleryImages.length > 2 && (
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Image src={rhythmGalleryImages[1].imageUrl} alt={rhythmGalleryImages[1].description} width={800} height={600} className="w-full h-full object-cover" data-ai-hint={rhythmGalleryImages[1].imageHint} />
                                <Image src={rhythmGalleryImages[2].imageUrl} alt={rhythmGalleryImages[2].description} width={800} height={600} className="w-full h-full object-cover" data-ai-hint={rhythmGalleryImages[2].imageHint} />
                            </div>
                        )}
                       
                        {/* Medium image, right-aligned */}
                        {rhythmGalleryImages.length > 3 && (
                             <div className="w-full flex justify-end">
                                <div className="w-full md:w-3/4">
                                     <Image src={rhythmGalleryImages[3].imageUrl} alt={rhythmGalleryImages[3].description} width={1200} height={800} className="w-full h-full object-cover" data-ai-hint={rhythmGalleryImages[3].imageHint} />
                                </div>
                            </div>
                        )}

                        {/* Large image */}
                        {rhythmGalleryImages.length > 4 && (
                            <div className="w-full h-auto">
                                <Image src={rhythmGalleryImages[4].imageUrl} alt={rhythmGalleryImages[4].description} width={1600} height={900} className="w-full h-full object-cover" data-ai-hint={rhythmGalleryImages[4].imageHint} />
                            </div>
                        )}
                    </>
                )}
            </section>
            
            {/* SECTION 2: PROOF */}
            <section className="h-screen w-full flex items-center justify-center overflow-hidden relative py-24">
                <div className="w-full max-w-4xl mx-auto px-4">
                    {credentials.map((cred, index) => {
                        const isAligned = scrollPercentage > 35 && scrollPercentage < 55;
                        const initialTop = 10 + index * 20;
                        const initialLeft = 10 + (index % 2 === 0 ? index * 15 : 100 - index * 15 - 30);
                        const opacity = isAligned ? 1 : 0.3;

                        return (
                             <div 
                                key={cred.name}
                                className="absolute transition-all duration-1000 ease-in-out"
                                style={{
                                    top: isAligned ? `${25 + index * 12.5}%` : `${initialTop}%`,
                                    left: isAligned ? `50%` : `${initialLeft}%`,
                                    transform: isAligned ? 'translateX(-50%)' : 'translateX(0)',
                                    opacity
                                }}
                            >
                                <div className="flex justify-between items-center w-80">
                                    <span>{cred.name}</span>
                                    <span>{cred.year}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* SECTION 4: THE NUMBERS */}
            <StatsSection />
            
            {/* SECTION 5: THE PERSONALITY */}
            <section className="h-screen w-full relative flex items-center justify-center py-24">
                 {rhythmGalleryImages.length > 0 && <Image src={PlaceHolderImages.find(p => p.id === 'about-headshot')?.imageUrl || ''} alt="Self Portrait" fill className="object-cover" data-ai-hint="photographer workspace" />}
                <div className="absolute inset-0 bg-black/50" />
                 <div className="relative z-10 text-white text-4xl md:text-6xl font-extralight text-center">
                    {personalityWords.map((word, index) => {
                         const showWord = scrollPercentage > 75 + (index * 2);
                         return (
                            <p key={word} className={cn("transition-opacity duration-1000", showWord ? "opacity-100" : "opacity-0")}>{word}</p>
                         )
                    })}
                </div>
            </section>

            {/* SECTION 8: THE INVITATION */}
            <section className="h-screen w-full relative flex flex-col items-center justify-center text-center p-4">
                 {contactImage && (
                    <Image
                        src={contactImage.imageUrl}
                        alt=""
                        fill
                        className="object-cover blur-sm animate-ken-burns"
                        aria-hidden="true"
                    />
                )}
                <div className="absolute inset-0 bg-background/80"></div>

                <div className="relative z-10 text-foreground">
                    <h2 className="font-headline text-3xl md:text-5xl mb-8">Let's Work Together</h2>
                    <a href="mailto:hello@ahmedfareed.com" className="text-lg md:text-2xl font-body block mb-2 hover:underline">
                        hello@ahmedfareed.com
                    </a>
                    <p className="text-sm text-muted-foreground mb-8">RESPONSE WITHIN 24 HOURS</p>
                    <p className="text-xs text-muted-foreground/50">Currently {localTime} in my timezone.</p>
                </div>
            </section>

             {/* Final Image */}
            {contactImage && (
                <section className="w-full">
                     <Image src={contactImage.imageUrl} alt={contactImage.description} width={1920} height={1080} className="w-full h-auto" data-ai-hint={contactImage.imageHint} />
                </section>
            )}
        </div>
    );
}
