
'use client';

import { useState, useEffect, useRef } from 'react';
import { getSiteStats, SiteStat } from '@/lib/supabase-service';

const AnimatedNumber = ({ target }: { target: number }) => {
    const [current, setCurrent] = useState(0);
    const duration = 2000;
    const frameRate = 60;
    const totalFrames = duration / (1000 / frameRate);
    const increment = target / totalFrames;

    useEffect(() => {
        let frame = 0;
        const counter = setInterval(() => {
            frame++;
            const newCurrent = Math.min(target, current + increment * frame);
             setCurrent(Math.round(newCurrent));
            if (newCurrent >= target) {
                clearInterval(counter);
            }
        }, 1000 / frameRate);
        return () => clearInterval(counter);
    }, [target, increment]);

    return <span>+{current < 10 ? '0' : ''}{current}</span>;
}

export default function StatsSection() {
    const [isVisible, setIsVisible] = useState(false);
    const [stats, setStats] = useState<SiteStat[]>([]);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );
        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }
        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    useEffect(() => {
        // Detect site from window.location (client only)
        let site: 'travel' | 'commercial' = 'travel';
        try {
            const host = window.location.hostname;
            const parts = host.split('.');
            if (parts[0] === 'commercial') site = 'commercial';
            if (site === 'travel') {
                const firstSeg = window.location.pathname.split('/')[1];
                if (firstSeg === 'commercial') site = 'commercial';
            }
        } catch {}
        getSiteStats(site).then(setStats);
    }, []);

    return (
        <section ref={sectionRef} className="min-h-[50vh] w-full flex items-center justify-center text-center py-10 md:py-14 transition-opacity duration-1000" style={{ opacity: isVisible ? 1 : 0.1 }}>
            <div className={`grid grid-cols-1 md:grid-cols-${stats.length} gap-10 md:gap-20`}>
                {stats.map((stat, idx) => (
                    <div key={stat.id} className="flex flex-col">
                        <p className="text-7xl font-thin">
                            {isVisible && <AnimatedNumber target={stat.value} />}
                        </p>
                        <p className="text-sm tracking-widest text-muted-foreground">{stat.label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
