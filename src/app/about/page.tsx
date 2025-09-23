import type { Metadata } from "next";
import Image from "next/image";
import Timeline from "@/components/timeline";
import { PortfolioService } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "About Me | Ahmed Fareed",
  description: "Learn about Ahmed Fareed's background, inspiration, and creative philosophy as a photographer.",
};

export default async function AboutPage() {
  // Get about description and headshot from settings
  const [headshotSetting, aboutDescriptionSetting] = await Promise.all([
    PortfolioService.getSetting('about_headshot_id'),
    PortfolioService.getSetting('about_description'),
  ]);
  
  const headshotId = headshotSetting?.value;
  const aboutDescription = aboutDescriptionSetting?.value || 'My creative philosophy is simple: to capture authentic moments in the most beautiful way possible. I believe that the best photographs are not staged, but are born from genuine emotion and connection. My goal is to create images that are both timeless and deeply personal.';
  
  const allImages = await PortfolioService.getImages();
  const headshot = allImages.find(i => i.id === headshotId);

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
            <p className="text-[18px] font-body">Ahmed Fareed</p>
            <div className="h-[80px]" />
            <p className="text-[14px] leading-[2.2]">
                {aboutDescription}
            </p>
            <div className="h-[100px]" />
            <p className="text-sm tracking-[0.2em]">PRECISION · PATIENCE · PERSPECTIVE</p>

            <div className="mt-24">
                <Timeline />
            </div>
         </div>
      </div>
    </div>
  );
}
