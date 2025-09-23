import type { Metadata } from 'next';
import PortfolioGallery from '@/components/portfolio-gallery';

export const metadata: Metadata = {
  title: 'Portfolio | Ahmed Fareed',
  description: 'Explore galleries of wedding, portrait, and landscape photography by Ahmed Fareed.',
};

export default function PortfolioPage() {
  return <PortfolioGallery />;
}
