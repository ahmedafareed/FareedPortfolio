'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type HeroImage = { id: string; imageUrl: string; description: string; imageHint?: string };

interface ParallaxHeroProps {
    images: HeroImage[];
    tagline?: string;
}

export default function ParallaxHero({ images, tagline = 'AVAILABLE FOR COMMISSIONS' }: ParallaxHeroProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // 15s cycle / 3 images = 5s per image
        return () => clearInterval(interval);
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
        <section className="h-screen w-full relative flex items-center justify-center overflow-hidden">
            {/* Background Images */}
            {images.map((image, index) => (
                <div
                    key={image.id}
                    className="absolute inset-0 transition-opacity duration-[3000ms] ease-in-out"
                    style={{ 
                        opacity: index === currentImageIndex ? 1 : 0,
                        transform: `translate(${parallaxX}px, ${parallaxY}px) scale(1.05)`,
                        transition: 'transform 0.2s ease-out, opacity 3s ease-in-out'
                    }}
                >
                    <Image
                        src={image.imageUrl}
                        alt={image.description}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        data-ai-hint={image.imageHint}
                    />
                </div>
            ))}
            <div className="absolute inset-0 bg-black/30"></div>

            {/* Center Element */}
            <div className="relative z-10 text-center">
                <h1 className="text-5xl md:text-8xl text-white font-extralight tracking-widest">
                    AHMED FAREED
                </h1>
            </div>

            {/* Bottom Right Corner */}
            <div className="absolute bottom-10 right-10 z-10">
                <p className="text-white text-xs font-light tracking-widest animate-pulse">
                    {tagline}
                </p>
            </div>
        </section>
    );
}
