'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { PortfolioService, type PortfolioImageWithCategory } from '@/lib/supabase';
import { useLocale } from '@/components/locale-provider';

type FullImage = PortfolioImageWithCategory & { width: number; height: number };

export default function PortfolioGallery() {
  const { locale, dictionary } = useLocale();
  const [site, setSite] = useState<'travel' | 'commercial'>('travel');
  const [categories, setCategories] = useState<Array<{ id: string; name: string; display_name: string }>>([]);
  const [activeCategory, setActiveCategory] = useState<string | 'All'>('All');
  const [images, setImages] = useState<FullImage[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<FullImage | null>(null);

  const load = async () => {
    let site: 'travel' | 'commercial' = 'travel';
    try {
      const host = window.location.hostname;
      const parts = host.split('.');
      if (parts[0] === 'commercial' || parts.includes('commercial')) site = 'commercial';
      if (site === 'travel') {
        const firstSeg = window.location.pathname.split('/')[1];
        if (firstSeg === 'commercial' || window.location.pathname.split('/').includes('commercial')) site = 'commercial';
      }
    } catch {}
    setSite(site);
    const [rawCats, rawImgs] = await Promise.all([
      PortfolioService.getCategories(site),
      PortfolioService.getImages(undefined, site),
    ]);
    const [cats, imgs] = await Promise.all([
      PortfolioService.localizeRecords(rawCats, site, locale, 'category', ['name', 'display_name', 'description']),
      PortfolioService.localizeRecords(rawImgs, site, locale, 'image', ['title', 'description', 'alt_text']),
    ]);
    setCategories(cats.map(c => ({ id: c.id, name: c.name, display_name: c.display_name })));
    setImages((imgs || []).map(i => ({
      ...i,
      width: i.width || 1200,
      height: i.height || 800,
    })) as FullImage[]);
  };

  useEffect(() => { load(); }, [locale]);

  const sortByUploadDate = (a: FullImage, b: FullImage) => {
    const dateDifference = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return dateDifference || b.sort_order - a.sort_order;
  };
  const filtered = (activeCategory === 'All' ? images : images.filter(i => i.category_id === activeCategory))
    .slice()
    .sort(sortByUploadDate);
  const activeCategoryData = categories.find(category => category.id === activeCategory);
  const isEditorialCategory =
    site === 'commercial' &&
    activeCategory !== 'All' &&
    !!activeCategoryData &&
    /editorial/i.test(`${activeCategoryData.name} ${activeCategoryData.display_name}`);
  const editorialStories = isEditorialCategory
    ? Array.from(
        filtered.reduce((stories, image) => {
          const label = getEditorialStoryLabel(image.title);
          const imagesForLabel = stories.get(label) || [];
          imagesForLabel.push(image);
          stories.set(label, imagesForLabel);
          return stories;
        }, new Map<string, FullImage[]>()),
      )
    : [];

  const openLightbox = (image: FullImage) => {
    setSelectedImage(image);
    setLightboxOpen(true);
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-16 lg:py-24 min-h-screen">
      <div className="sticky top-16 md:top-0 bg-background/95 backdrop-blur-sm z-10 py-3 sm:py-4 mb-4 sm:mb-8">
        <div className="flex justify-center items-center flex-wrap gap-2 sm:gap-4">
            <button
              onClick={() => setActiveCategory('All')}
              className={cn(
                'font-body tracking-widest transition-all duration-300 text-xs sm:text-sm px-2 py-1 sm:px-0 sm:py-0 rounded sm:rounded-none',
                activeCategory === 'All' 
                  ? 'font-bold opacity-100 bg-primary text-primary-foreground sm:bg-transparent sm:text-foreground' 
                  : 'font-normal opacity-30 hover:opacity-100'
              )}
            >
              {dictionary.pages.portfolioAll.toUpperCase()}
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={cn(
                  'font-body tracking-widest transition-all duration-300 text-xs sm:text-sm px-2 py-1 sm:px-0 sm:py-0 rounded sm:rounded-none',
                  activeCategory === c.id 
                    ? 'font-bold opacity-100 bg-primary text-primary-foreground sm:bg-transparent sm:text-foreground' 
                    : 'font-normal opacity-30 hover:opacity-100'
                )}
              >
                {c.display_name.toUpperCase()}
              </button>
            ))}
        </div>
      </div>

      {isEditorialCategory ? (
        <div className="space-y-14 sm:space-y-16">
          {editorialStories.map(([storyLabel, storyImages]) => (
            <section key={storyLabel} className="space-y-4 sm:space-y-5">
              <h2 className="text-sm sm:text-base font-semibold tracking-[0.2em] uppercase">{storyLabel}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                {storyImages.map((image) => (
                  <div key={image.id} className="break-inside-avoid mb-1 sm:mb-1.5 lg:mb-2" style={{ aspectRatio: `${image.width} / ${image.height}` }} onClick={() => openLightbox(image)}>
                    <div className="relative overflow-hidden cursor-pointer group shadow-md">
                      <Image
                        src={image.image_url}
                        alt={image.description || ''}
                        width={image.width}
                        height={image.height}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        className="w-full h-auto object-cover transition-all duration-400 saturate-[.9] group-hover:saturate-100"
                        data-ai-hint={image.alt_text || ''}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 sm:gap-1.5 lg:gap-2">
          {filtered.map((image) => (
            <div
              key={image.id}
              className="break-inside-avoid mb-1 sm:mb-1.5 lg:mb-2"
              style={{ aspectRatio: `${image.width} / ${image.height}` }}
              onClick={() => openLightbox(image)}
            >
              <div className="relative overflow-hidden cursor-pointer group shadow-md">
                <Image
                  src={image.image_url}
                  alt={image.description || ''}
                  width={image.width}
                  height={image.height}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="w-full h-auto object-cover transition-all duration-400 saturate-[.9] group-hover:saturate-100"
                  data-ai-hint={image.alt_text || ''}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
              </div>
            </div>
          ))}
        </div>
      )}

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

function getEditorialStoryLabel(title: string | null): string {
  const normalizedTitle = (title || '').trim();
  if (!normalizedTitle) return 'Untitled Story';
  const [storyLabel] = normalizedTitle.split(' - ');
  return (storyLabel || normalizedTitle).trim();
}
