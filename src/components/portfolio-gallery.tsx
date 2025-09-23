'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PortfolioCategory, portfolioCategories, getFullPortfolioImages } from '@/lib/data';
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
  
  const categories: (PortfolioCategory | 'All')[] = ['All', ...portfolioCategories];

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 min-h-screen">
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 py-4">
        <div className="flex justify-center items-center space-x-4">
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                        "font-body tracking-widest transition-all duration-300",
                        activeCategory === category ? "font-bold opacity-100" : "font-normal opacity-30 hover:opacity-100"
                    )}
                >
                    {category.toUpperCase()}
                </button>
            ))}
        </div>
      </div>

      <div
        className="columns-1 md:columns-2 lg:columns-3 gap-4"
      >
        {filteredImages.map((image, index) => (
          <div
            key={image.id}
            className="break-inside-avoid mb-4"
            onClick={() => openLightbox(image)}
          >
            <div className="relative overflow-hidden cursor-pointer group">
                <Image
                  src={image.imageUrl}
                  alt={image.description}
                  width={image.width}
                  height={image.height}
                  className={cn(
                      "w-full h-auto object-cover transition-all duration-400 saturate-[.9] group-hover:saturate-100",
                      image.aspectRatio === 'portrait' ? 'md:col-span-1' : ''
                    )}
                  data-ai-hint={image.imageHint}
                />
              </div>
          </div>
        ))}
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[85vw] max-h-[85vh] w-auto h-auto bg-transparent border-0 shadow-none flex items-center justify-center p-0">
          {selectedImage && (
            <Image
              src={selectedImage.imageUrl}
              alt={selectedImage.description}
              width={1600}
              height={1200}
              className="w-auto h-auto object-contain max-w-[85vw] max-h-[85vh] rounded-lg"
              data-ai-hint={selectedImage.imageHint}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
