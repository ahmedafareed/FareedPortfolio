import type { Metadata } from 'next';
import { getRequestLocale } from '@/lib/i18n-server';
import { getDictionary } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = getDictionary(await getRequestLocale());
  return { title: `${dictionary.pages.exhibitions} | Ahmed Fareed`, description: dictionary.pages.exhibitionsSoon };
}

export default function ExhibitionsPage() {
  return <ExhibitionsContent />;
}

async function ExhibitionsContent() {
  const dictionary = getDictionary(await getRequestLocale());
  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 min-h-screen flex justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-headline mb-8">{dictionary.pages.exhibitions}</h1>
        {/* TODO: Implement exhibitions list or import from awards-list if needed */}
        <p className="text-muted-foreground">{dictionary.pages.exhibitionsSoon}</p>
      </div>
    </div>
  );
}
