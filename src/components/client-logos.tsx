'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { PortfolioService, type ClientLogo } from '@/lib/supabase';
import { useLocale } from '@/components/locale-provider';

export default function ClientLogos({ site }: { site: 'travel' | 'commercial' }) {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const { dictionary } = useLocale();

  useEffect(() => {
    if (site === 'commercial') PortfolioService.getClientLogos(site).then(setLogos);
  }, [site]);

  if (site !== 'commercial' || logos.length === 0) return null;
  return (
    <section aria-labelledby="clients-title" className="w-full py-12 md:py-16">
      <div className="site-container text-center">
        <h2 id="clients-title" className="font-headline text-3xl md:text-4xl">{dictionary.clients.title}</h2>
        <div className="mt-8 flex snap-x justify-center gap-8 overflow-x-auto pb-3" aria-label="Previous clients">
          {logos.map(logo => <div key={logo.id} className="relative flex h-24 min-w-44 snap-start items-center justify-center grayscale"><Image src={logo.image_url} alt={logo.alt_text || logo.title} fill loading="lazy" sizes="176px" className="object-contain" /></div>)}
        </div>
      </div>
    </section>
  );
}