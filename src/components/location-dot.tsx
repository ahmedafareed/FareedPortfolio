'use client';

import { usePathname } from "next/navigation";
import Link from 'next/link';
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const navItems = [
  { href: '/', label: 'Home', shape: 'circle' },
  { href: '/portfolio', label: 'Portfolio', shape: 'filled-circle' },
  { href: '/about', label: 'About', shape: 'square' },
    { href: '/awards', label: 'Awards & Exhibitions', shape: 'diamond' },
  { href: '/contact', label: 'Contact', shape: 'plus' },
];

const Shape = ({ shape, className }: { shape: string; className?: string }) => {
    // The foreground color is inverted by the mix-blend-difference, so we use a white color here.
    const shapeColor = "bg-white"; 
    const borderColor = "border-white";
    const strokeColor = "text-white";

    switch (shape) {
        case 'circle':
            return <div className={cn("w-[6px] h-[6px] rounded-full border", borderColor, className)}></div>;
        case 'filled-circle':
            return <div className={cn("w-[6px] h-[6px] rounded-full", shapeColor, className)}></div>;
        case 'square':
            return <div className={cn("w-[6px] h-[6px]", shapeColor, className)}></div>;
        case 'diamond':
            return <div className={cn("w-[6px] h-[6px] transform rotate-45", shapeColor, className)}></div>;
        case 'plus':
            return <Plus className={cn("w-[6px] h-[6px]", strokeColor, className)} />;
        default:
            return null;
    }
};

export default function LocationDot() {
    const pathname = usePathname();
    const currentItem = navItems.find(item => item.href === pathname);

    return (
        <div className="fixed top-10 left-10 z-50 mix-blend-difference">
            <Popover>
                <PopoverTrigger asChild>
                    <button className="flex items-center justify-center w-6 h-6" aria-label="Open navigation menu">
                        {currentItem && <Shape shape={currentItem.shape} />}
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2 bg-white border border-border shadow-lg" side="bottom" align="start">
                    <nav>
                        <ul>
                            {navItems.map(item => (
                                <li key={item.href}>
                                    <Link href={item.href} className="flex items-center gap-4 px-3 py-2 text-sm font-body text-black hover:bg-gray-100 rounded-sm">
                                        <Shape shape={item.shape} />
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </PopoverContent>
            </Popover>
        </div>
    )
}
