import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { Metadata } from "next";
import Image from "next/image";
import Timeline from "@/components/timeline";

export const metadata: Metadata = {
  title: "About Me | Ahmed Fareed",
  description: "Learn about Ahmed Fareed's background, inspiration, and creative philosophy as a photographer.",
};

export default function AboutPage() {
    const headshot = PlaceHolderImages.find(p => p.id === 'about-headshot');

  return (
    <div className="grid md:grid-cols-2 min-h-screen">
      <div className="relative h-screen hidden md:block">
        {headshot && (
            <Image
                src={headshot.imageUrl}
                alt={headshot.description}
                fill
                className="w-full h-full object-cover grayscale"
                data-ai-hint={headshot.imageHint}
                priority
            />
        )}
      </div>
      <div className="flex flex-col justify-center items-start p-8 md:p-16 lg:p-24">
         <div className="w-full max-w-md mx-auto">
            <div className="md:hidden mb-8">
              {headshot && (
                  <Image
                      src={headshot.imageUrl}
                      alt={headshot.description}
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover grayscale"
                      data-ai-hint={headshot.imageHint}
                  />
              )}
            </div>
            <p className="text-[18px] font-body">Ahmed Fareed</p>
            <div className="h-[80px]" />
            <p className="text-[14px] leading-[2.2]">
                My creative philosophy is simple: to capture authentic moments in the most beautiful way possible. I believe that the best photographs are not staged, but are born from genuine emotion and connection. My goal is to create images that are both timeless and deeply personal.
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
