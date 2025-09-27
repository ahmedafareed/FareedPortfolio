'use client';

import { usePathname } from "next/navigation";
import Link from 'next/link';
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, useEffect } from "react";

// Base navigation items without site prefix
const baseNavItems = [
  { href: '', label: 'Home', shape: 'circle' },
  { href: '/portfolio', label: 'Portfolio', shape: 'filled-circle' },
  { href: '/about', label: 'About', shape: 'square' },
  { href: '/awards', label: 'Awards & Exhibitions', shape: 'diamond' },
  { href: '/contact', label: 'Contact', shape: 'plus' },
];

const Shape = ({ shape, className }: { shape: string; className?: string }) => {
    // Gold color for navigation dot
    const shapeColor = "bg-yellow-500"; 
    const borderColor = "border-yellow-500";
    const strokeColor = "text-yellow-500";

    switch (shape) {
        case 'circle':
            return <div className={cn("w-[10px] h-[10px] rounded-full border", borderColor, className)}></div>;
        case 'filled-circle':
            return <div className={cn("w-[10px] h-[10px] rounded-full", shapeColor, className)}></div>;
        case 'square':
            return <div className={cn("w-[10px] h-[10px]", shapeColor, className)}></div>;
        case 'diamond':
            return <div className={cn("w-[10px] h-[10px] transform rotate-45", shapeColor, className)}></div>;
        case 'plus':
            return <Plus className={cn("w-[10px] h-[10px]", strokeColor, className)} />;
        default:
            return null;
    }
};

export default function LocationDot() {
    const pathname = usePathname();
    const [site, setSite] = useState<'travel' | 'commercial'>('travel');
    const [navItems, setNavItems] = useState(baseNavItems);

    // Detect site and build navigation items
    useEffect(() => {
        let detectedSite: 'travel' | 'commercial' = 'travel';
        if (typeof window !== 'undefined') {
            try {
                const host = window.location.hostname;
                // Check for subdomain in production
                if (host.startsWith('commercial.')) {
                    detectedSite = 'commercial';
                } else if (host.startsWith('travel.')) {
                    detectedSite = 'travel';
                } else {
                    // Fallback for dev: check path
                    const pathFirst = pathname.split('/')[1];
                    if (pathFirst === 'commercial') detectedSite = 'commercial';
                    else if (pathFirst === 'travel') detectedSite = 'travel';
                }
            } catch {
                detectedSite = 'travel';
            }
        }
        setSite(detectedSite);
        // Determine if we're on a subdomain (production) or main domain (preview/dev)
        let isSubdomain = false;
        if (typeof window !== 'undefined') {
            const host = window.location.hostname;
            if (host.startsWith('commercial.') || host.startsWith('travel.')) {
                isSubdomain = true;
            }
        }
        // On subdomain: use root-relative links; on main domain: use prefix
        const sitePrefix = isSubdomain ? '' : (detectedSite === 'travel' ? '/travel' : '/commercial');
        const siteNavItems = baseNavItems.map(item => ({
            ...item,
            href: sitePrefix + (item.href === '' ? '' : item.href)
        }));
        setNavItems(siteNavItems);
    }, [pathname]);

    // Find current item - handle both exact matches and homepage variations
    const currentItem = navItems.find(item => {
        if (item.href === pathname) return true;
        
        // Handle homepage: /travel, /commercial, or root /
        if (item.label === 'Home') {
            if (pathname === '/travel' || pathname === '/commercial') return true;
            if (pathname === '/' && site === 'travel') return true;
        }
        
        return false;
    });

    return (
        <div className="fixed top-10 left-10 z-50">
            <Popover>
                <PopoverTrigger asChild>
                    <button className="flex items-center justify-center w-6 h-6 group" aria-label="Open navigation menu">
                        <div className="relative">
                            {currentItem && <Shape shape={currentItem.shape} className="animate-pulse group-hover:animate-ping transition-all duration-300" />}
                            <div className="absolute inset-0 rounded-full bg-yellow-500 opacity-20 animate-ping group-hover:opacity-40"></div>
                        </div>
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2 bg-white border border-border shadow-lg" side="bottom" align="start">
                    <nav>
                        <ul>
                            {navItems.map((item) => (
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
