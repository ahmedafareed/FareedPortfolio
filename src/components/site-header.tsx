'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLocale } from '@/components/locale-provider';
import { localeNames, supportedLocales } from '@/lib/i18n';

export default function SiteHeader() {
  const pathname = usePathname();
  const { locale, dictionary } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathParts = pathname.split('/');
  const sitePrefix = pathParts.includes('commercial') ? '/commercial' : pathParts.includes('travel') ? '/travel' : '';
  const localePrefix = locale === 'en' ? '' : `/${locale}`;
  const routeWithoutLocale = /^\/(es|ca)(\/|$)/.test(pathname) ? pathname.replace(/^\/(es|ca)/, '') || '/' : pathname;
  const isLanding = pathname === '/' || pathname.endsWith('/travel') || pathname.endsWith('/commercial');
  const [visible, setVisible] = useState(!(pathname === '/commercial'));
  const links = [
    { href: `${localePrefix}${sitePrefix}/portfolio`, label: dictionary.nav.portfolio },
    { href: `${localePrefix}${sitePrefix}/about`, label: dictionary.nav.about },
    { href: `${localePrefix}${sitePrefix}/awards`, label: dictionary.nav.awards },
    { href: `${localePrefix}${sitePrefix}/contact`, label: dictionary.nav.contact },
  ];

  useEffect(() => {
    const isSubdomain = window.location.hostname.startsWith('commercial.');
    if (pathname !== '/commercial' && !(pathname === '/' && isSubdomain)) {
      setVisible(true);
      return;
    }
    const showAfterIntro = () => setVisible(Boolean(window.sessionStorage.getItem('commercial-genre')));
    showAfterIntro();
    window.addEventListener('commercial-genre-selected', showAfterIntro);
    return () => window.removeEventListener('commercial-genre-selected', showAfterIntro);
  }, [pathname]);

  if (!visible) return null;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 md:px-16 md:py-8 ${isLanding ? 'text-white' : 'text-ink'}`}>
      <a href={`${localePrefix}${sitePrefix || '/'}`} className="text-sm font-semibold tracking-[0.18em]">AHMED FAREED</a>
      <nav className="hidden items-center gap-8 text-xs uppercase tracking-[0.16em] md:flex" aria-label={dictionary.accessibility.primary}>
        {links.map(link => <a key={link.href} href={link.href} className="hover:text-accent-blue">{link.label}</a>)}
      </nav>
      <div className="hidden items-center gap-2 text-[10px] uppercase tracking-[0.14em] md:flex" aria-label="Language selection">
        {supportedLocales.map(targetLocale => <a key={targetLocale} href={`${targetLocale === 'en' ? '' : `/${targetLocale}`}${routeWithoutLocale}`} aria-current={targetLocale === locale ? 'page' : undefined} className={targetLocale === locale ? 'font-bold' : 'opacity-50 hover:opacity-100'}>{localeNames[targetLocale]}</a>)}
      </div>
      <button type="button" onClick={() => setMenuOpen(open => !open)} className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] md:hidden ${isLanding ? 'border-white/60' : 'border-ink/40'}`} aria-label={dictionary.accessibility.openMenu} aria-expanded={menuOpen} aria-controls="site-mobile-navigation">Menu</button>
      {menuOpen && <nav id="site-mobile-navigation" className="absolute right-5 top-16 flex min-w-52 flex-col gap-4 rounded-2xl bg-ink p-5 text-xs uppercase tracking-[0.16em] text-paper shadow-xl md:hidden" aria-label={dictionary.accessibility.mobile}>{links.map(link => <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>)}<div className="flex gap-3 border-t border-paper/20 pt-3">{supportedLocales.map(targetLocale => <a key={targetLocale} href={`${targetLocale === 'en' ? '' : `/${targetLocale}`}${routeWithoutLocale}`} onClick={() => setMenuOpen(false)}>{localeNames[targetLocale]}</a>)}</div></nav>}
    </header>
  );
}