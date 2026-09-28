'use client';

import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/components/locale-provider';
import { localeNames, supportedLocales } from '@/lib/i18n';

interface GenreFinderProps {
  imageUrl?: string;
  imageAlt?: string;
  genres: { id: string; label: string }[];
  onSelect: (genreId: string) => void;
}

export default function GenreFinder({ imageUrl, imageAlt = '', genres, onSelect }: GenreFinderProps) {
  const [selectedGenre, setSelectedGenre] = useState('');
  const pathname = usePathname();
  const { locale, dictionary } = useLocale();
  const routeWithoutLocale = /^\/(es|ca)(\/|$)/.test(pathname) ? pathname.replace(/^\/(es|ca)/, '') || '/' : pathname;

  return (
    <section className="relative min-h-screen overflow-hidden bg-ink text-ink" aria-labelledby="genre-finder-title">
      {imageUrl && <Image src={imageUrl} alt={imageAlt} fill loading="lazy" className="object-cover opacity-70" sizes="100vw" />}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent" aria-hidden="true" />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col justify-between px-5 py-8 md:px-16 md:py-12">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em]">
          <span>{dictionary.genre.welcome}</span>
          <div className="flex items-center gap-3">
            <div className="flex gap-2" aria-label="Language selection">
              {supportedLocales.map(targetLocale => <a key={targetLocale} href={`${targetLocale === 'en' ? '' : `/${targetLocale}`}${routeWithoutLocale}`} aria-current={targetLocale === locale ? 'page' : undefined} className={targetLocale === locale ? 'font-bold' : 'opacity-60 hover:opacity-100'}>{localeNames[targetLocale]}</a>)}
            </div>
            <span>Ahmed Fareed</span>
          </div>
        </div>
        <fieldset className="max-w-3xl border-0 p-0 font-body">
          <p className="max-w-3xl text-xl leading-[1.8] md:text-3xl md:leading-[1.65]">{dictionary.genre.intro}</p>
          <legend id="genre-finder-title" className="sr-only">{dictionary.genre.looking}</legend>
          <div className="mt-10 flex flex-wrap items-center gap-3 text-base md:text-xl">
            <span aria-hidden="true" className="text-sm uppercase tracking-[0.18em]">{dictionary.genre.looking}</span>
            <label htmlFor="genre-select" className="sr-only">{dictionary.accessibility.chooseGenre}</label>
            <select id="genre-select" value={selectedGenre} onChange={event => { setSelectedGenre(event.target.value); onSelect(event.target.value); }} className="min-h-11 rounded-full border border-ink/30 bg-paper px-5 py-3 text-sm text-ink">
              <option value="" disabled>{dictionary.genre.choose}</option>
              {genres.map((genre) => <option key={genre.id} value={genre.id}>{genre.label}</option>)}
            </select>
            <span aria-hidden="true" className="text-sm uppercase tracking-[0.18em]">{dictionary.genre.photographer}</span>
          </div>
        </fieldset>
        <div className="border-t border-ink/20 pt-4 text-xs uppercase tracking-[0.18em]">{dictionary.genre.status}</div>
      </div>
    </section>
  );
}