"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ParallaxHero from '@/components/parallax-hero';
import StatsSection from '@/components/stats-section';
import { cn } from '@/lib/utils';
import { PortfolioService, type PortfolioCategory } from '@/lib/supabase';
import { Instagram, Facebook, Phone, MessageCircle } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import AwardsList from '@/components/awards-list';
import GenreFinder from '@/components/genre-finder';
import ClientLogos from '@/components/client-logos';
import { useLocale } from '@/components/locale-provider';



const personalityWords = ['OBSERVER', 'STORYTELLER'];

export default function Home() {
    const { locale, dictionary } = useLocale();
    const [scrollPercentage, setScrollPercentage] = useState(0);
    const [localTime, setLocalTime] = useState('');
    const [contactEmail, setContactEmail] = useState('ahmedamfareed@gmail.com');
    const [siteTagline, setSiteTagline] = useState('AVAILABLE FOR COMMISSIONS');
    const [displayTagline, setDisplayTagline] = useState('TRAVEL PHOTOGRAPHER');
    
    // Intersection observers for scroll animations
    const { ref: awardsExhibitionsRef, isIntersecting: awardsExhibitionsVisible } = useIntersectionObserver({
        threshold: 0.15,
        rootMargin: '-40px 0px',
    });

    const [site, setSite] = useState<'travel' | 'commercial'>('travel');
    const [commercialIntroComplete, setCommercialIntroComplete] = useState(true);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [categories, setCategories] = useState<PortfolioCategory[]>([]);
    const [heroImages, setHeroImages] = useState<{ id: string; imageUrl: string; description: string; imageHint?: string }[]>([]);
    const [gridImages, setGridImages] = useState<{ imageUrl: string; description: string; imageHint?: string; categoryId?: string | null }[]>([]);
    const [contactImage, setContactImage] = useState<{ imageUrl: string; description: string; imageHint?: string } | null>(null);
    const [featuredStory, setFeaturedStory] = useState('');
    const [currentGridImageIndices, setCurrentGridImageIndices] = useState<number[]>([0, 1, 2, 3, 4, 5]);
    // Removed local awards/exhibitions preview state – we now reuse <AwardsList /> logic directly.

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
            // Determine site from hostname (client-side). Fallback to 'travel' if none.
            let detectedSite: 'travel' | 'commercial' = 'travel';
                        try {
                                const host = window.location.hostname;
                                const parts = host.split('.');
                                if (parts[0] === 'commercial' || parts.includes('commercial')) detectedSite = 'commercial';
                                // Path fallback (e.g., /commercial/* in dev environments without subdomain)
                                if (detectedSite === 'travel') {
                                    const pathFirst = window.location.pathname.split('/')[1];
                                    if (pathFirst === 'commercial' || window.location.pathname.split('/').includes('commercial')) detectedSite = 'commercial';
                                }
                        } catch {}
            setSite(detectedSite);
            const storedCategory = detectedSite === 'commercial' ? window.sessionStorage.getItem('commercial-genre') : null;
            if (detectedSite === 'commercial' && storedCategory) setSelectedCategoryId(storedCategory);
            if (detectedSite === 'commercial' && !storedCategory) setCommercialIntroComplete(false);
            
            // Set appropriate tagline based on site
            const defaultTagline = detectedSite === 'commercial' ? dictionary.hero.commercial : dictionary.hero.travel;
            setDisplayTagline(defaultTagline);

            const [heroSetting, featuredImagesRaw, allImagesRaw, taglineSetting, emailSetting, categoryDataRaw] = await Promise.all([
                PortfolioService.getSetting('hero_image_id', detectedSite),
                PortfolioService.getFeaturedImages(detectedSite),
                PortfolioService.getImages(undefined, detectedSite),
                PortfolioService.getSetting('site_tagline', detectedSite, locale),
                PortfolioService.getSetting('contact_email', detectedSite),
                PortfolioService.getCategories(detectedSite),
            ]);
            const [featuredImages, allImages, categoryData] = await Promise.all([
                PortfolioService.localizeRecords(featuredImagesRaw, detectedSite, locale, 'image', ['title', 'description', 'alt_text']),
                PortfolioService.localizeRecords(allImagesRaw, detectedSite, locale, 'image', ['title', 'description', 'alt_text']),
                PortfolioService.localizeRecords(categoryDataRaw, detectedSite, locale, 'category', ['name', 'display_name', 'description']),
            ]);
            setCategories(categoryData);

            // Set contact email and tagline if available
            if (emailSetting?.value) {
                setContactEmail(emailSetting.value);
            }
            if (taglineSetting?.value) {
                setSiteTagline(taglineSetting.value);
            }

            const heroId = heroSetting?.value;
            
            // Find hero image first - prioritize hero setting over featured/first image
            let hero = null;
            
            // 1. Try to find hero by ID from all images
            if (heroId && allImages.length > 0) {
                hero = allImages.find((i) => i.id === heroId);
            }
            
            // 2. If no hero by ID, find image marked as is_hero from all images
            if (!hero && allImages.length > 0) {
                hero = allImages.find((i) => i.is_hero === true);
            }
            
            // 3. Fallback to first featured image
            if (!hero && featuredImages.length > 0) {
                hero = featuredImages[0];
            }
            
            // 4. Final fallback to first image
            if (!hero && allImages.length > 0) {
                hero = allImages[0];
            }
            
            const images = detectedSite === 'commercial' ? allImages : (featuredImages.length > 0 ? featuredImages : allImages);
            
            if (hero && images && images.length > 0) {
                setFeaturedStory(hero.title || hero.description || '');
                const rest = images.filter((i) => i.id !== hero?.id).slice(0, 2);
                setHeroImages([
                    { id: hero?.id || 'hero', imageUrl: hero?.image_url || '', description: hero?.description || '', imageHint: hero?.alt_text || '' },
                    ...rest.map(i => ({ id: i.id, imageUrl: i.image_url, description: i.description || '', imageHint: i.alt_text || '' }))
                ]);

                // Use all images for grid rotation
                const grid = images.map(i => ({ imageUrl: i.image_url, description: i.description || '', imageHint: i.alt_text || '', categoryId: i.category_id }));
                setGridImages(grid);

                // Use last featured as contact backdrop
                setContactImage(grid[grid.length - 1] || null);
            } else {
                setHeroImages([]);
                setGridImages([]);
                setContactImage(null);
            }

            // Awards & Exhibitions now handled by standalone <AwardsList /> below.
        })();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll to the top of the page on load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const displayedGridImages = site === 'commercial' && selectedCategoryId
        ? gridImages.filter(image => image.categoryId === selectedCategoryId)
        : gridImages;

    // Grid image rotation effect: rotate one random tile at a time, no fades
    useEffect(() => {
        setCurrentGridImageIndices([0, 1, 2, 3, 4, 5]);
        if (displayedGridImages.length <= 6) return;
        const interval = setInterval(() => {
            setCurrentGridImageIndices(prev => {
                const next = [...prev];
                const tile = Math.floor(Math.random() * 6); // pick a tile to update
                const currentIndex = next[tile];
                let newIndex = (currentIndex + 1) % displayedGridImages.length;
                // ensure not duplicating any currently visible image
                const visibleSet = new Set(next);
                let attempts = 0;
                while (visibleSet.has(newIndex) && attempts < displayedGridImages.length) {
                    newIndex = (newIndex + 1) % displayedGridImages.length;
                    attempts++;
                }
                next[tile] = newIndex;
                return next;
            });
        }, 700);
        return () => clearInterval(interval);
    }, [displayedGridImages.length, selectedCategoryId]);

    const chooseGenre = (categoryId: string) => {
        setSelectedCategoryId(categoryId);
        setCommercialIntroComplete(true);
        window.sessionStorage.setItem('commercial-genre', categoryId);
        window.dispatchEvent(new Event('commercial-genre-selected'));
    };

    if (site === 'commercial' && !commercialIntroComplete) {
        return <GenreFinder imageUrl={heroImages[0]?.imageUrl} imageAlt={heroImages[0]?.imageHint} genres={categories.map(category => ({ id: category.id, label: category.display_name }))} onSelect={chooseGenre} />;
    }



    return (
        <div className="bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
            {/* PROGRESS THREAD */}
            <div className="fixed right-5 top-0 h-full w-px bg-border/50 z-50">
                <div className="absolute top-0 left-0 h-full w-full bg-primary transition-transform duration-150 ease-linear" style={{ transform: `scaleY(${scrollPercentage / 100})`, transformOrigin: 'top' }} />
            </div>
            
            {/* SECTION 1: INTRODUCTION */}
            {heroImages.length > 0 && <ParallaxHero images={heroImages} tagline={displayTagline} featuredTitle={featuredStory} />}

            {/* SECTION 2: THE WORK - 2x3 rotating grid */}
            <section id="work" className="w-full py-6 md:py-10 px-0 md:px-0">
                {displayedGridImages.length > 0 && (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-[2px] sm:gap-1 md:gap-2 lg:gap-3 w-full" style={{ gridAutoRows: 'minmax(100px, 1fr)' }}>
                            {Array.from({ length: 6 }, (_, index) => {
                                const imageIndex = currentGridImageIndices[index] ?? index % displayedGridImages.length;
                                const image = displayedGridImages.length > 0 ? displayedGridImages[imageIndex % displayedGridImages.length] : undefined;
                                return (
                                    <div key={index} className="relative overflow-hidden bg-gray-100 aspect-[4/3]">
                                        {image && (
                                            <Image 
                                                src={image.imageUrl} 
                                                alt={image.imageHint || image.description || ''}
                                                fill
                                                loading="lazy"
                                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 33vw"
                                                className="object-cover"
                                                data-ai-hint={image.description} 
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        {/* Explore More Button */}
                        <div className="w-full flex justify-center mt-8">
                            <ExploreMoreButton />
                        </div>
                    </>
                )}
            </section>
            
            {/* SECTION 3: AWARDS & EXHIBITIONS (reused component) */}
            <section id="recognition"
                ref={awardsExhibitionsRef}
                className={cn(
                    "w-full py-8 md:py-14 px-3 sm:px-4 md:px-6 lg:px-8 transition-all duration-1000 ease-out",
                    awardsExhibitionsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
            >
                <div className={cn(
                    "max-w-5xl mx-auto transition-all duration-700", 
                    awardsExhibitionsVisible ? 'opacity-100' : 'opacity-0'
                )}>
                    <AwardsList />
                </div>
            </section>

            {/* SECTION 4: THE NUMBERS */}
            <StatsSection />
            <ClientLogos site={site} />

                {/* Removed personality section to keep homepage focused and clean */}

            {/* SECTION 4: THE INVITATION + social links */}
            <section className="w-full relative flex flex-col items-center justify-center text-center p-8 md:p-12">
                {contactImage && (
                    <div className="absolute inset-0 -z-10">
                        <Image
                            src={contactImage.imageUrl}
                            alt=""
                            fill
                            loading="lazy"
                            className="object-cover blur-sm"
                            aria-hidden="true"
                        />
                        <div className="absolute inset-0 bg-background/80" />
                    </div>
                )}
                <div className="relative z-10 text-foreground">
                    <h2 className="font-headline text-3xl md:text-5xl mb-6">{dictionary.home.together}</h2>
                    <a href={`mailto:${contactEmail}`} className="text-lg md:text-2xl font-body block mb-1 hover:underline">
                        {contactEmail}
                    </a>
                    <p className="text-sm text-muted-foreground mb-6">{dictionary.home.response}</p>
                    <div className="flex items-center justify-center gap-6 text-muted-foreground">
                        <a href="https://facebook.com/ahmadafareed/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-foreground">
                            <Facebook className="w-6 h-6" />
                        </a>
                        <a href="https://instagram.com/fareedph" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-foreground">
                            <Instagram className="w-6 h-6" />
                        </a>
                        <a href="https://wa.me/201280021316" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-foreground">
                            <MessageCircle className="w-6 h-6" />
                        </a>
                        <a href="tel:+201280021316" aria-label="Phone" className="hover:text-foreground">
                            <Phone className="w-6 h-6" />
                        </a>
                    </div>
                    <p className="text-xs text-muted-foreground/60 mt-6">Currently {localTime} in my timezone.</p>
                </div>
            </section>
            {/* Removed final full-width image to keep the page lean */}
        </div>
    );
}

function ExploreMoreButton() {
    const { dictionary } = useLocale();
    // Detect site from window.location
    let site: 'travel' | 'commercial' = 'travel';
    if (typeof window !== 'undefined') {
        try {
            const host = window.location.hostname;
            const parts = host.split('.');
            if (parts[0] === 'commercial') site = 'commercial';
            if (site === 'travel') {
                const firstSeg = window.location.pathname.split('/')[1];
                if (firstSeg === 'commercial') site = 'commercial';
            }
        } catch {}
    }
    const href = site === 'commercial' ? '/commercial/portfolio' : '/travel/portfolio';
    return (
        <a
            href={href}
            className="inline-block px-8 py-3 rounded bg-primary text-primary-foreground font-semibold text-lg shadow hover:bg-primary/90 transition-colors duration-200"
        >
            {dictionary.home.explore}
        </a>
    );
}
