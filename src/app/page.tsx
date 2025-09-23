'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ParallaxHero from '@/components/parallax-hero';
import StatsSection from '@/components/stats-section';
import { cn } from '@/lib/utils';
import { PortfolioService } from '@/lib/supabase';

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
    const [contactEmail, setContactEmail] = useState('hello@ahmedfareed.com');
    const [siteTagline, setSiteTagline] = useState('AVAILABLE FOR COMMISSIONS');

    const [heroImages, setHeroImages] = useState<{ id: string; imageUrl: string; description: string; imageHint?: string }[]>([]);
    const [rhythmGalleryImages, setRhythmGalleryImages] = useState<{ imageUrl: string; description: string; imageHint?: string }[]>([]);
    const [contactImage, setContactImage] = useState<{ imageUrl: string; description: string; imageHint?: string } | null>(null);

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

        // Load images and settings from Supabase
        (async () => {
            const [heroSetting, featuredImages, allImages, taglineSetting, emailSetting] = await Promise.all([
                PortfolioService.getSetting('hero_image_id'),
                PortfolioService.getFeaturedImages(),
                PortfolioService.getImages(),
                PortfolioService.getSetting('site_tagline'),
                PortfolioService.getSetting('contact_email'),
            ]);

            // Set contact email and tagline if available
            if (emailSetting?.value) {
                setContactEmail(emailSetting.value);
            }
            if (taglineSetting?.value) {
                setSiteTagline(taglineSetting.value);
            }

            const heroId = heroSetting?.value;
            const images = featuredImages.length > 0 ? featuredImages : allImages;
            
            if (images && images.length > 0) {
                let hero = null;
                
                // First try to find hero by ID from all images (not just featured)
                if (heroId) {
                    hero = allImages.find((i) => i.id === heroId);
                }
                
                // If no hero found by ID, use first featured image, or first image
                if (!hero) {
                    hero = images[0];
                }
                
                const rest = images.filter((i) => i.id !== hero?.id).slice(0, 2);
                setHeroImages([
                    { id: hero?.id || 'hero', imageUrl: hero?.image_url || '', description: hero?.description || '', imageHint: hero?.alt_text || '' },
                    ...rest.map(i => ({ id: i.id, imageUrl: i.image_url, description: i.description || '', imageHint: i.alt_text || '' }))
                ]);

                // Use more featured images for rhythm section
                const rhythm = images.slice(0, 5).map(i => ({ imageUrl: i.image_url, description: i.description || '', imageHint: i.alt_text || '' }));
                setRhythmGalleryImages(rhythm);

                // Use last featured as contact backdrop
                setContactImage(rhythm[rhythm.length - 1] || null);
            } else {
                setHeroImages([]);
                setRhythmGalleryImages([]);
                setContactImage(null);
            }
        })();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    return (
        <div className="bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
            {/* PROGRESS THREAD */}
            <div className="fixed right-5 top-0 h-full w-px bg-border/50 z-50">
                <div className="absolute top-0 left-0 h-full w-full bg-primary transition-transform duration-150 ease-linear" style={{ transform: `scaleY(${scrollPercentage / 100})`, transformOrigin: 'top' }} />
            </div>
            
            {/* SECTION 1: INTRODUCTION */}
            {heroImages.length > 0 && <ParallaxHero images={heroImages} tagline={siteTagline} />}

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
                        const isAligned = scrollPercentage > 50 && scrollPercentage < 70;
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
                 {/* Optional background if you add a headshot later */}
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
                    <a href={`mailto:${contactEmail}`} className="text-lg md:text-2xl font-body block mb-2 hover:underline">
                        {contactEmail}
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
