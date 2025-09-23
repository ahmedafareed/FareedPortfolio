'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PortfolioCategory, portfolioCategories, getFullPortfolioImages } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type FullPortfolioImage = ReturnType<typeof getFullPortfolioImages>[0];

export default function PortfolioGallery() {
  const allImages = getFullPortfolioImages();
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory | 'All'>('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<FullPortfolioImage | null>(null);

  const filteredImages =
    activeCategory === 'All'
      ? allImages
      : allImages.filter((image) => image.category === activeCategory);
  
  const openLightbox = (image: FullPortfolioImage) => {
    setSelectedImage(image);
    setLightboxOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24">
      <div className="text-center mb-12 animate-in fade-in-0 duration-500">
        <h1 className="font-headline text-5xl md:text-6xl tracking-tight">Portfolio</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          A collection of my favorite moments captured through the lens.
        </p>
      </div>

      <div className="flex justify-center flex-wrap gap-2 mb-12 animate-in fade-in-0 duration-500 delay-200">
        <Button
          variant={activeCategory === 'All' ? 'default' : 'outline'}
          onClick={() => setActiveCategory('All')}
          className={cn("bg-transparent", activeCategory === 'All' && "bg-primary text-primary-foreground")}
        >
          All
        </Button>
        {portfolioCategories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? 'default' : 'outline'}
            onClick={() => setActiveCategory(category)}
            className={cn("bg-transparent", activeCategory === category && "bg-primary text-primary-foreground")}
          >
            {category}
          </Button>
        ))}
      </div>

      <div
        className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6"
      >
        {filteredImages.map((image, index) => (
          <div
            key={image.id}
            className="break-inside-avoid animate-in fade-in-0 duration-500"
            style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
            onClick={() => openLightbox(image)}
          >
            <Card className="overflow-hidden cursor-pointer group border-2 border-transparent hover:border-primary transition-all duration-300">
              <CardContent className="p-0">
                <Image
                  src={image.imageUrl}
                  alt={image.description}
                  width={image.width}
                  height={image.height}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                  data-ai-hint={image.imageHint}
                />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl w-full p-2 bg-transparent border-0">
          {selectedImage && (
            <Image
              src={selectedImage.imageUrl}
              alt={selectedImage.description}
              width={1600}
              height={1200}
              className="w-full h-auto object-contain rounded-lg max-h-[90vh]"
              data-ai-hint={selectedImage.imageHint}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
