'use client';

import { usePathname } from "next/navigation";
import Link from 'next/link';
import { Home, Aperture, User, Award, Mail, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const navItems = [
  { href: '/', label: 'Home', shape: 'circle' },
  { href: '/portfolio', label: 'Portfolio', shape: 'filled-circle' },
  { href: '/about', label: 'About', shape: 'square' },
  { href: '/awards', label: 'Awards', shape: 'diamond' },
  { href: '/contact', label: 'Contact', shape: 'plus' },
];

const Shape = ({ shape, className }: { shape: string; className?: string }) => {
    switch (shape) {
        case 'circle':
            return <div className={cn("w-[6px] h-[6px] rounded-full border border-foreground", className)}></div>;
        case 'filled-circle':
            return <div className={cn("w-[6px] h-[6px] rounded-full bg-foreground", className)}></div>;
        case 'square':
            return <div className={cn("w-[6px] h-[6px] bg-foreground", className)}></div>;
        case 'diamond':
            return <div className={cn("w-[6px] h-[6px] bg-foreground transform rotate-45", className)}></div>;
        case 'plus':
            return <Plus className={cn("w-[6px] h-[6px]", className)} />;
        default:
            return null;
    }
};

export default function LocationDot() {
    const pathname = usePathname();
    const currentItem = navItems.find(item => item.href === pathname);

    return (
        <div className="fixed top-10 left-10 z-50">
            <Popover>
                <PopoverTrigger asChild>
                    <button className="flex items-center justify-center w-6 h-6" aria-label="Open navigation menu">
                        {currentItem && <Shape shape={currentItem.shape} />}
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2 bg-background/80 backdrop-blur-sm border-border" side="bottom" align="start">
                    <nav>
                        <ul>
                            {navItems.map(item => (
                                <li key={item.href}>
                                    <Link href={item.href} className="flex items-center gap-4 px-3 py-2 text-sm font-body hover:bg-muted/50 rounded-sm">
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
