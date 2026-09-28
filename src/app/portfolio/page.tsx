import type { Metadata } from 'next';
import PortfolioGallery from '@/components/portfolio-gallery';
import { getRequestLocale } from '@/lib/i18n-server';
import { getDictionary } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = getDictionary(await getRequestLocale());
  return { title: `${dictionary.pages.portfolio} | Ahmed Fareed`, description: dictionary.pages.portfolio };
}

export default function PortfolioPage() {
  return <PortfolioGallery />;
}
