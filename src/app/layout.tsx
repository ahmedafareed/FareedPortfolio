import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import SiteHeader from '@/components/site-header';
import LocaleProvider from '@/components/locale-provider';
import { headers } from 'next/headers';
import { isLocale, type Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const localeHeader = (await headers()).get('x-locale');
  const locale: Locale = isLocale(localeHeader) ? localeHeader : 'en';
  const descriptions = {
    en: 'Portfolio of photographer Ahmed Fareed, specializing in weddings, portraits, and landscapes.',
    es: 'Portafolio del fotógrafo Ahmed Fareed, especializado en bodas, retratos y paisajes.',
    ca: 'Portafoli del fotògraf Ahmed Fareed, especialitzat en casaments, retrats i paisatges.',
  };
  return { title: 'Ahmed Fareed | Photographer', description: descriptions[locale] };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localeHeader = (await headers()).get('x-locale');
  const locale: Locale = isLocale(localeHeader) ? localeHeader : 'en';
  return (
    <html lang={locale} className="!scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=PT+Sans:wght@200;400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
        )}
      >
        <LocaleProvider locale={locale}>
          <div className="relative flex min-h-screen">
            <SiteHeader />
            <main className="flex-1">{children}</main>
          </div>
        </LocaleProvider>
        <Toaster />
      </body>
    </html>
  );
}
