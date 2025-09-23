import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-main');
  const featuredImages = PlaceHolderImages.filter(p => p.id.startsWith("featured-")).slice(0, 4);
  const featuredTop = featuredImages.slice(0, 2);
  const featuredBottom = featuredImages.slice(2, 4);

  return (
    <div className="flex flex-col min-h-screen bg-background animate-in fade-in-0 duration-[2000ms] delay-[1500ms]">
      <section className="relative h-screen w-full flex items-center justify-center">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-px h-[30px] bg-foreground animate-pulse" />
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-10 gap-4 md:gap-8">
                {featuredTop.length === 2 && (
                    <>
                        <div className="col-span-10 md:col-span-6 relative group">
                            <Link href="/portfolio">
                                <Image src={featuredTop[0].imageUrl} alt={featuredTop[0].description} width={1200} height={800} className="object-cover w-full h-full" data-ai-hint={featuredTop[0].imageHint} />
                                <div className="absolute bottom-0 left-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="text-[10px] font-body text-white bg-black/50 px-1 py-0.5 rounded">Featured Work 1</p>
                                </div>
                            </Link>
                        </div>
                        <div className="col-span-10 md:col-span-4 relative group">
                            <Link href="/portfolio">
                                <Image src={featuredTop[1].imageUrl} alt={featuredTop[1].description} width={800} height={1200} className="object-cover w-full h-full" data-ai-hint={featuredTop[1].imageHint} />
                                <div className="absolute bottom-0 left-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="text-[10px] font-body text-white bg-black/50 px-1 py-0.5 rounded">Featured Work 2</p>
                                </div>
                            </Link>
                        </div>
                    </>
                )}
            </div>
             <div className="grid grid-cols-10 gap-4 md:gap-8 mt-4 md:mt-8">
                {featuredBottom.length === 2 && (
                    <>
                        <div className="col-span-10 md:col-span-4 relative group">
                             <Link href="/portfolio">
                                <Image src={featuredBottom[0].imageUrl} alt={featuredBottom[0].description} width={800} height={1200} className="object-cover w-full h-full" data-ai-hint={featuredBottom[0].imageHint} />
                                 <div className="absolute bottom-0 left-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="text-[10px] font-body text-white bg-black/50 px-1 py-0.5 rounded">Featured Work 3</p>
                                </div>
                            </Link>
                        </div>
                        <div className="col-span-10 md:col-span-6 relative group">
                             <Link href="/portfolio">
                                <Image src={featuredBottom[1].imageUrl} alt={featuredBottom[1].description} width={1200} height={800} className="object-cover w-full h-full" data-ai-hint={featuredBottom[1].imageHint} />
                                 <div className="absolute bottom-0 left-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="text-[10px] font-body text-white bg-black/50 px-1 py-0.5 rounded">Featured Work 4</p>
                                </div>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
      </section>
    </div>
  );
}
