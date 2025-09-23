'use client';

import { getFullAwards } from '@/lib/data';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function AwardsList() {
    const awardsData = getFullAwards().sort((a,b) => b.year - a.year);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLLIElement, MouseEvent>, targetDiv: HTMLDivElement | null) => {
        if (targetDiv) {
            const rect = e.currentTarget.getBoundingClientRect();
            setMousePosition({
                x: e.clientX - rect.left - 50,
                y: e.clientY - rect.top - 50,
            });
        }
    };
    
    return (
        <ul>
            {awardsData.map((award) => {
                const yearDiff = currentYear - award.year;
                const opacity = yearDiff > 5 ? 0.5 : 1 - (yearDiff * 0.1);

                return (
                    <li 
                        key={award.id} 
                        className="group relative flex flex-col md:flex-row justify-between items-start md:items-center py-[20px] border-b border-border last:border-b-0"
                        style={{ opacity }}
                        onMouseMove={(e) => handleMouseMove(e, e.currentTarget.querySelector('.proof-image'))}
                    >
                        <p className="mb-2 md:mb-0 md:order-2 text-right text-gray-400">{award.year}</p>
                        <p className="md:order-1 text-left">{award.title} - {award.event}</p>
                        <div 
                            className="proof-image pointer-events-none absolute z-10 top-0 left-0 w-[100px] h-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:group-hover:block hidden"
                            style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
                        >
                             <Image 
                                src={award.imageUrl} 
                                alt={`Proof for ${award.title}`} 
                                width={100} 
                                height={100} 
                                className="object-cover"
                             />
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
