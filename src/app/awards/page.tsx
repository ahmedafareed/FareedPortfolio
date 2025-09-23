import type { Metadata } from 'next';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { getFullAwards } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Awards & Exhibitions | Ahmed Fareed',
  description: 'A showcase of awards, publications, and exhibitions by photographer Ahmed Fareed.',
};

export default function AwardsPage() {
    const awardsData = getFullAwards();

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 flex flex-col items-center">
        <div className="text-center mb-12 animate-in fade-in-0 duration-500">
            <h1 className="font-headline text-5xl md:text-6xl tracking-tight">Awards & Exhibitions</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Recognitions and features that mark milestones in my photography journey.
            </p>
        </div>

        <div className="w-full max-w-4xl animate-in fade-in-0 duration-500 delay-200">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent>
                    {awardsData.map((award) => (
                        <CarouselItem key={award.id} className="md:basis-1/2 lg:basis-1/3">
                            <div className="p-1">
                                <Card className="h-full flex flex-col">
                                    <CardContent className="p-0">
                                        <div className="aspect-w-3 aspect-h-2">
                                            <Image
                                                src={award.imageUrl}
                                                alt={award.description}
                                                width={600}
                                                height={400}
                                                className="w-full object-cover rounded-t-lg"
                                                data-ai-hint={award.imageHint}
                                            />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex-1 flex flex-col items-start justify-center p-6">
                                        <h3 className="font-headline text-xl text-foreground">{award.title}</h3>
                                        <p className="text-sm text-muted-foreground">{award.event}, {award.year}</p>
                                    </CardFooter>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
            </Carousel>
        </div>
    </div>
  );
}
