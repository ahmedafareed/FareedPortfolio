'use client';

import { usePathname } from "next/navigation";
import Link from 'next/link';
import { Home, Aperture, User, Award, Mail, Plus, Diamond } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: '/', label: 'Home', icon: Home, shape: 'circle' },
  { href: '/portfolio', label: 'Portfolio', icon: Aperture, shape: 'filled-circle' },
  { href: '/about', label: 'About Me', icon: User, shape: 'square' },
  { href: '/awards', label: 'Awards', icon: Award, shape: 'diamond' },
  { href: '/contact', label: 'Contact', icon: Mail, shape: 'plus' },
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
            <Link href={currentItem?.href || "/"} aria-label={currentItem?.label || "current page"}>
                {currentItem && <Shape shape={currentItem.shape} />}
            </Link>
        </div>
    )
}
