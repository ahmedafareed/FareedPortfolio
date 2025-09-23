'use client';

import { PortfolioService, type Award, type Exhibition } from '@/lib/supabase';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function AwardsList() {
    const [awards, setAwards] = useState<Award[]>([]);
    const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const [awardsData, exhibitionsData] = await Promise.all([
                PortfolioService.getAwards(),
                PortfolioService.getExhibitions()
            ]);
            setAwards(awardsData.sort((a, b) => b.year - a.year));
            setExhibitions(exhibitionsData.sort((a, b) => b.year - a.year || b.month - a.month));
            setCurrentYear(new Date().getFullYear());
            setLoading(false);
        };
        loadData();
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
                <div>
                    <h2 className="text-2xl font-headline mb-8 text-center">Awards & Recognition</h2>
                    <ul>
                        {awards.map((award) => {
                            const yearDiff = currentYear - award.year;
                            const opacity = yearDiff > 5 ? 0.5 : 1 - (yearDiff * 0.1);

                            return (
                                <li 
                                    key={award.id} 
                                    className="group relative flex flex-col md:flex-row justify-between items-start md:items-center py-[20px] border-b border-border last:border-b-0"
                                    style={{ opacity, gap: '40px' }}
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
                <div>
                    <h2 className="text-2xl font-headline mb-8 text-center">Exhibitions</h2>
                    <ul>
                        {exhibitions.map((exhibition) => {
                            const yearDiff = currentYear - exhibition.year;
                            const opacity = yearDiff > 5 ? 0.5 : 1 - (yearDiff * 0.1);

                            return (
                                <li 
                                    key={exhibition.id} 
                                    className="group relative flex flex-col md:flex-row justify-between items-start md:items-center py-[20px] border-b border-border last:border-b-0"
                                    style={{ opacity, gap: '40px' }}
                                    onMouseMove={handleMouseMove}
                                >
                                    <p className="mb-2 md:mb-0 md:order-2 text-right text-gray-400">
                                        {monthNames[exhibition.month - 1]} {exhibition.year}
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