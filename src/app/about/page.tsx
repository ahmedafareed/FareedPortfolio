import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { Metadata } from "next";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "About Me | Ahmed Fareed",
  description: "Learn about Ahmed Fareed's background, inspiration, and creative philosophy as a photographer.",
};

const timeline = [
  { year: 2019, achievement: "First Solo Exhibition" },
  { year: 2020, achievement: "National Geographic Contest" },
  { year: 2021, achievement: "Exhibition at The Modern" },
  { year: 2022, achievement: "WPPI Awards" },
  { year: 2023, achievement: "Photographer of the Year" },
]

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
                <TooltipProvider>
                    <div className="relative flex justify-between items-center w-full">
                        <div className="absolute top-1/2 left-0 w-full h-px bg-border -translate-y-1/2" />
                        {timeline.map(item => (
                            <Tooltip key={item.year}>
                                <TooltipTrigger asChild>
                                    <div className="relative w-3 h-3 bg-foreground rounded-full cursor-pointer z-10" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{item.year}: {item.achievement}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                </TooltipProvider>
            </div>
         </div>
      </div>
    </div>
  );
}
