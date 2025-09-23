import type { Metadata } from 'next';
import { getFullAwards } from '@/lib/data';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Awards & Exhibitions | Ahmed Fareed',
  description: 'A showcase of awards, publications, and exhibitions by photographer Ahmed Fareed.',
};

export default function AwardsPage() {
    const awardsData = getFullAwards().sort((a,b) => b.year - a.year);
    const currentYear = new Date().getFullYear();

    return (
        <div className="container mx-auto px-4 py-16 sm:py-24 min-h-screen flex justify-center">
            <div className="w-full max-w-4xl">
                <ul>
                    {awardsData.map((award, index) => {
                        const yearDiff = currentYear - award.year;
                        const opacity = yearDiff > 5 ? 0.5 : 1 - (yearDiff * 0.1);

                        return (
                            <li 
                                key={award.id} 
                                className="group relative flex flex-col md:flex-row justify-between items-start md:items-center py-[20px] border-b border-border last:border-b-0"
                                style={{ opacity }}
                            >
                                <p className="mb-2 md:mb-0 md:order-2 text-right text-gray-400">{award.year}</p>
                                <p className="md:order-1 text-left">{award.title} - {award.event}</p>
                                <div className="pointer-events-none absolute z-10 top-0 left-0 w-[100px] h-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:group-hover:block hidden"
                                    style={{ transform: 'translate(var(--x, 0), var(--y, 0))' }}
                                    onMouseMoveCapture={(e) => {
                                        const target = e.currentTarget;
                                        const parent = target.parentElement;
                                        if (parent) {
                                            const rect = parent.getBoundingClientRect();
                                            target.style.setProperty('--x', `${e.clientX - rect.left - 50}px`);
                                            target.style.setProperty('--y', `${e.clientY - rect.top - 50}px`);
                                        }
                                    }}
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
            </div>
        </div>
    );
}
