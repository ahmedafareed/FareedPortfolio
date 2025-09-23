'use client';

import { useState, useEffect, useRef } from 'react';

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

    return (
        <section ref={sectionRef} className="h-screen w-full flex items-center justify-center text-center transition-opacity duration-1000" style={{ opacity: isVisible ? 1 : 0.1 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
                <div className="flex flex-col">
                    <p className="text-7xl font-thin">
                        {isVisible && <AnimatedNumber target={30} />}
                    </p>
                    <p className="text-sm tracking-widest text-muted-foreground">PROJECTS</p>
                </div>
                <div className="flex flex-col">
                     <p className="text-7xl font-thin">
                        {isVisible && <AnimatedNumber target={8} />}
                    </p>
                    <p className="text-sm tracking-widest text-muted-foreground">YEARS of Experience</p>
                </div>
            </div>
        </section>
    );
}
