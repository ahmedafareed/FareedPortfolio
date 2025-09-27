import type { Metadata } from "next";
import Image from "next/image";
import Timeline from "@/components/timeline";
import { PortfolioService } from "@/lib/supabase";
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: "About Me | Ahmed Fareed",
  description: "Learn about Ahmed Fareed.",
};

export default async function AboutPage() {
  const h = await headers();
  const site = (h.get('x-site-key') === 'commercial') ? 'commercial' : 'travel';
  // Get about description and headshot from settings
  const [headshotSetting, aboutDescriptionSetting] = await Promise.all([
    PortfolioService.getSetting('about_headshot_id', site),
    PortfolioService.getSetting('about_description', site),
  ]);

  let headshotId = headshotSetting?.value;
  const aboutDescription = aboutDescriptionSetting?.value || 'My creative philosophy is simple: to capture authentic moments in the most beautiful way possible. I believe that the best photographs are not staged, but are born from genuine emotion and connection. My goal is to create images that show the characteristic beauty of every creation.';

  let allImages = await PortfolioService.getImages(undefined, site);
  let headshot = allImages.find(i => i.id === headshotId);

  // Fallback: if commercial headshot missing, use travel headshot
  if (site === 'commercial' && !headshot) {
    const travelHeadshotSetting = await PortfolioService.getSetting('about_headshot_id', 'travel');
    const travelHeadshotId = travelHeadshotSetting?.value;
    const travelImages = await PortfolioService.getImages(undefined, 'travel');
    headshot = travelImages.find(i => i.id === travelHeadshotId);
  }

  return (
    <div className="grid md:grid-cols-2 min-h-screen">
      <div className="relative h-screen hidden md:block">
    {headshot && (
            <Image
        src={headshot.image_url}
        alt={headshot.description || ''}
                fill
                className="w-full h-full object-cover grayscale"
        data-ai-hint={headshot.alt_text || ''}
                priority
            />
        )}
      </div>
      <div className="flex flex-col justify-center items-start p-8 md:p-16 lg:p-24">
         <div className="w-full max-w-md mx-auto">
            <div className="md:hidden mb-8">
        {headshot && (
                  <Image
            src={headshot.image_url}
            alt={headshot.description || ''}
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover grayscale"
            data-ai-hint={headshot.alt_text || ''}
                  />
              )}
            </div>
            <p className="text-[18px] font-body font-bold mb-4">Ahmed Fareed</p>
            <p className="text-[15px] leading-[2.2] mb-8">
              {aboutDescription}
            </p>
         </div>
      </div>
    </div>
  );
}
