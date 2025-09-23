import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Me | Ahmed Fareed",
  description: "Learn about Ahmed Fareed's background, inspiration, and creative philosophy as a photographer.",
};

export default function AboutPage() {
    const headshot = PlaceHolderImages.find(p => p.id === 'about-headshot');

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-12 animate-in fade-in-0 duration-500">
            <h1 className="font-headline text-5xl md:text-6xl tracking-tight">About Me</h1>
        </div>
      <div className="grid md:grid-cols-5 gap-12 items-center animate-in fade-in-0 duration-500 delay-200">
        <div className="md:col-span-2">
            <Card className="overflow-hidden">
                <CardContent className="p-0">
                    {headshot && (
                         <Image
                            src={headshot.imageUrl}
                            alt={headshot.description}
                            width={500}
                            height={500}
                            className="w-full h-auto object-cover"
                            data-ai-hint={headshot.imageHint}
                         />
                    )}
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-3 space-y-6 text-lg text-muted-foreground">
          <h2 className="font-headline text-3xl text-foreground">A Passion for Visual Storytelling</h2>
          <p>
            From a young age, I was fascinated by the power of a single image to tell a complex story. My journey into photography started not with a camera, but with a keen observation of the world around me—the play of light and shadow, the fleeting emotions on people's faces, and the breathtaking beauty of the natural world.
          </p>
          <p>
            My creative philosophy is simple: to capture authentic moments in the most beautiful way possible. I believe that the best photographs are not staged, but are born from genuine emotion and connection. Whether I'm documenting a wedding, creating a portrait, or exploring a remote landscape, my goal is to create images that are both timeless and deeply personal.
          </p>
          <p>
            With over a decade of professional experience, I've had the honor of working with diverse clients and having my work featured in numerous publications and galleries. But for me, the greatest reward is seeing the joy my photographs bring to others, preserving their cherished memories for generations to come.
          </p>
        </div>
      </div>
    </div>
  );
}
