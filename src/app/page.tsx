import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-main');
  const featuredImages = PlaceHolderImages.filter(p => p.id.startsWith("featured-"));

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative h-[calc(100vh-5rem)] w-full flex items-center justify-center">
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
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center text-white px-4 animate-in fade-in-0 duration-1000">
          <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl tracking-tight">
            Ahmed Fareed
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-neutral-200">
            Capturing life's moments in timeless photographs. Serving the greater region with passion and creativity.
          </p>
          <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/portfolio">
              Explore My Work <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-4xl md:text-5xl text-center mb-12">
            Featured Work
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredImages.map((image, index) => (
              <Link href="/portfolio" key={image.id} className="group">
                <Card className="overflow-hidden border-2 border-transparent hover:border-primary transition-all duration-300">
                   <CardContent className="p-0">
                    <div className="aspect-w-4 aspect-h-3">
                       <Image
                        src={image.imageUrl}
                        alt={image.description}
                        width={600}
                        height={450}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 animate-in fade-in-0"
                        style={{animationDelay: `${index * 150}ms`, animationFillMode: 'backwards'}}
                        data-ai-hint={image.imageHint}
                       />
                    </div>
                   </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
