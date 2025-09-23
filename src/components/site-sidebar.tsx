'use client';

import {
  Aperture,
  Award,
  Home,
  Mail,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/portfolio', label: 'Portfolio', icon: Aperture },
  { href: '/about', label: 'About Me', icon: User },
  { href: '/awards', label: 'Awards', icon: Award },
  { href: '/contact', label: 'Contact', icon: Mail },
];

export default function SiteSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 h-screen w-16 md:w-64 bg-[hsl(var(--sidebar-background))] text-sidebar-foreground border-r border-sidebar-border flex flex-col">
      <div className="flex items-center justify-center md:justify-start h-20 border-b border-sidebar-border px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Aperture className="h-8 w-8 text-accent" />
          <span className="hidden md:block font-headline text-xl font-bold">
            Ahmed Fareed
          </span>
        </Link>
      </div>
      <nav className="flex-1 px-2 md:px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Button
                asChild
                variant={pathname === item.href ? 'secondary' : 'ghost'}
                className="w-full justify-center md:justify-start"
              >
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-4 p-3 rounded-lg transition-colors',
                    pathname === item.href
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className="hidden md:block">{item.label}</span>
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto p-4 border-t border-sidebar-border text-center hidden md:block">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Ahmed Fareed</p>
      </div>
    </aside>
  );
}
