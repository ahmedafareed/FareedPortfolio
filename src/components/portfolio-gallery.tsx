'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { PortfolioService, type PortfolioImageWithCategory, type PortfolioCategory as Category } from '@/lib/supabase';

type FullImage = PortfolioImageWithCategory & { width: number; height: number };

export default function PortfolioGallery() {
  const [categories, setCategories] = useState<Array<{ id: string; display_name: string }>>([]);
  const [activeCategory, setActiveCategory] = useState<string | 'All'>('All');
  const [images, setImages] = useState<FullImage[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<FullImage | null>(null);

  const load = async () => {
    const [cats, imgs] = await Promise.all([
      PortfolioService.getCategories(),
      PortfolioService.getImages(),
    ]);
    setCategories(cats.map(c => ({ id: c.id, display_name: c.display_name })));
    setImages((imgs || []).map(i => ({
      ...i,
      width: i.width || 1200,
      height: i.height || 800,
    })) as FullImage[]);
  };

  useEffect(() => { load(); }, []);

  const filtered = activeCategory === 'All' ? images : images.filter(i => i.category_id === activeCategory);

  const openLightbox = (image: FullImage) => {
    setSelectedImage(image);
    setLightboxOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 min-h-screen">
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 py-4">
        <div className="flex justify-center items-center space-x-4">
            <button
              onClick={() => setActiveCategory('All')}
              className={cn('font-body tracking-widest transition-all duration-300', activeCategory === 'All' ? 'font-bold opacity-100' : 'font-normal opacity-30 hover:opacity-100')}
            >
              ALL
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={cn('font-body tracking-widest transition-all duration-300', activeCategory === c.id ? 'font-bold opacity-100' : 'font-normal opacity-30 hover:opacity-100')}
              >
                {c.display_name.toUpperCase()}
              </button>
            ))}
        </div>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
        {filtered.map((image) => (
          <div key={image.id} className="break-inside-avoid mb-4" onClick={() => openLightbox(image)}>
            <div className="relative overflow-hidden cursor-pointer group">
              <Image
                src={image.image_url}
                alt={image.description || ''}
                width={image.width}
                height={image.height}
                className={cn('w-full h-auto object-cover transition-all duration-400 saturate-[.9] group-hover:saturate-100', image.aspect_ratio === 'portrait' ? 'md:col-span-1' : '')}
                data-ai-hint={image.alt_text || ''}
              />
            </div>
          </div>
        ))}
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[85vw] max-h-[85vh] w-auto h-auto bg-transparent border-0 shadow-none flex items-center justify-center p-0">
          {selectedImage && (
            <Image
              src={selectedImage.image_url}
              alt={selectedImage.description || ''}
              width={1600}
              height={1200}
              className="w-auto h-auto object-contain max-w-[85vw] max-h-[85vh] rounded-lg"
              data-ai-hint={selectedImage.alt_text || ''}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
