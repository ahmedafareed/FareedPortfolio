'use client';

import { PortfolioService, type Award, type Exhibition } from '@/lib/supabase';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';

export default function AwardsList() {
    const [awards, setAwards] = useState<Award[]>([]);
    const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const awardsRef = useRef<HTMLDivElement>(null);
    const exhibitionsRef = useRef<HTMLDivElement>(null);
    const [awardsVisible, setAwardsVisible] = useState(false);
    const [exhibitionsVisible, setExhibitionsVisible] = useState(false);
    const [awardsAnimKey, setAwardsAnimKey] = useState(0);
    const [exhibitionsAnimKey, setExhibitionsAnimKey] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
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
            const [awardsData, exhibitionsData] = await Promise.all([
                PortfolioService.getAwards(site),
                PortfolioService.getExhibitions(site)
            ]);
            setAwards(awardsData.sort((a, b) => b.year - a.year));
            setExhibitions(exhibitionsData.sort((a, b) => {
                const am = a.month ? parseInt(a.month, 10) : 0;
                const bm = b.month ? parseInt(b.month, 10) : 0;
                return b.year - a.year || bm - am;
            }));
            setCurrentYear(new Date().getFullYear());
            setLoading(false);
        };
        loadData();
    }, []);

    // Scroll event-based animation trigger for both sections
    useEffect(() => {
        function handleScroll() {
            if (awardsRef.current) {
                const rect = awardsRef.current.getBoundingClientRect();
                const inView = rect.top < window.innerHeight && rect.bottom > 0;
                setAwardsVisible(inView);
                if (inView) setAwardsAnimKey(prev => prev + 1);
            }
            if (exhibitionsRef.current) {
                const rect = exhibitionsRef.current.getBoundingClientRect();
                const inView = rect.top < window.innerHeight && rect.bottom > 0;
                setExhibitionsVisible(inView);
                if (inView) setExhibitionsAnimKey(prev => prev + 1);
            }
        }
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLLIElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left - 50, // 50 is half of the image width
            y: e.clientY - rect.top - 50,   // 50 is half of the image height
        });
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    if (loading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="text-gray-500">Loading awards and exhibitions...</div>
            </div>
        );
    }
    
    return (
        <div className="space-y-12">
            {/* Awards Section */}
            {awards.length > 0 && (
                <div ref={awardsRef}>
                    <div className="mb-2">
                        <span className="block text-lg font-semibold text-black text-center tracking-wide">Awards & Recognition</span>
                    </div>
                    <h2
                        className={`text-2xl font-headline mb-8 text-center transition-all duration-700 text-black ${awardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                        key={awardsAnimKey}
                    >
                        Recent Achievements
                    </h2>
                    <ul>
                        {awards.map((award, idx) => {
                            const yearDiff = currentYear - award.year;
                            const opacity = yearDiff > 5 ? 0.5 : 1 - (yearDiff * 0.1);
                            return (
                                <li
                                    key={award.id}
                                    className={`group relative flex flex-col md:flex-row justify-between items-start md:items-center py-[20px] border-b border-border last:border-b-0 transition-all duration-700 ${awardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                                    style={{
                                        opacity,
                                        gap: '40px',
                                        transitionDelay: awardsVisible ? `${idx * 100 + 200}ms` : '0ms'
                                    }}
                                    onMouseMove={handleMouseMove}
                                >
                                    <p className="mb-2 md:mb-0 md:order-2 text-right text-gray-400">{award.year}</p>
                                    <p className="md:order-1 text-left">{award.title} - {award.event}</p>
                                    {award.image_url && (
                                        <div
                                            className="pointer-events-none absolute z-10 top-0 left-0 w-[100px] h-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:group-hover:block hidden"
                                            style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
                                        >
                                            <Image
                                                src={award.image_url}
                                                alt={`Proof for ${award.title}`}
                                                width={100}
                                                height={100}
                                                className="object-cover rounded shadow-lg"
                                            />
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            {/* Exhibitions Section */}
            {exhibitions.length > 0 && (
                <div ref={exhibitionsRef}>
                    <div className="mb-2">
                        <span className="block text-lg font-semibold text-black text-center tracking-wide">Exhibitions</span>
                    </div>
                    <h2
                        className={`text-2xl font-headline mb-8 text-center transition-all duration-700 text-black ${exhibitionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                        key={exhibitionsAnimKey}
                    >
                        Recent Shows & Venues
                    </h2>
                    <ul>
                        {exhibitions.map((exhibition, idx) => {
                            const yearDiff = currentYear - exhibition.year;
                            const opacity = yearDiff > 5 ? 0.5 : 1 - (yearDiff * 0.1);
                            return (
                                <li
                                    key={exhibition.id}
                                    className={`group relative flex flex-col md:flex-row justify-between items-start md:items-center py-[20px] border-b border-border last:border-b-0 transition-all duration-700 ${exhibitionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                                    style={{
                                        opacity,
                                        gap: '40px',
                                        transitionDelay: exhibitionsVisible ? `${idx * 100 + 200}ms` : '0ms'
                                    }}
                                    onMouseMove={handleMouseMove}
                                >
                                    <p className="mb-2 md:mb-0 md:order-2 text-right text-gray-400">
                                        {monthNames[(exhibition.month ? parseInt(exhibition.month, 10) : 1) - 1]} {exhibition.year}
                                    </p>
                                    <div className="md:order-1 text-left">
                                        <p className="font-medium">{exhibition.title}</p>
                                        <p className="text-sm text-gray-600">{exhibition.venue}, {exhibition.location}</p>
                                        {exhibition.description && (
                                            <p className="text-xs text-gray-500 mt-1">{exhibition.description}</p>
                                        )}
                                    </div>
                                    {exhibition.image_url && (
                                        <div
                                            className="pointer-events-none absolute z-10 top-0 left-0 w-[100px] h-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:group-hover:block hidden"
                                            style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
                                        >
                                            <Image
                                                src={exhibition.image_url}
                                                alt={`Image from ${exhibition.title}`}
                                                width={100}
                                                height={100}
                                                className="object-cover rounded shadow-lg"
                                            />
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            {/* Empty State */}
            {awards.length === 0 && exhibitions.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-gray-500">No awards or exhibitions to display yet.</p>
                </div>
            )}
        </div>
    );
}