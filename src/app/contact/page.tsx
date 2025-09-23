import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Instagram, Linkedin } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Contact | Ahmed Fareed',
  description: 'Get in touch with Ahmed Fareed for bookings, collaborations, or inquiries.',
};

const socialLinks = [
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
];

export default function ContactPage() {
  const portfolioImages = PlaceHolderImages.filter(p => p.id.startsWith("portfolio-"));

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center p-4">
      <div className="absolute inset-0 z-0">
        {portfolioImages.map((image, index) => (
          <Image
            key={image.id}
            src={image.imageUrl}
            alt=""
            fill
            className={`object-cover transition-opacity duration-[3000ms] ease-in-out opacity-0 animate-fade-in-out`}
            style={{ animationDelay: `${index * 5}s` }}
            aria-hidden="true"
          />
        ))}
        <div className="absolute inset-0 bg-background/95"></div>
      </div>
      
      <div className="relative z-10">
        <a href="mailto:contact@ahmedfareed.com" className="text-base font-body block mb-4">
          contact@ahmedfareed.com
        </a>
        <div className="flex justify-center items-center space-x-2 group">
          <span className="text-muted-foreground/50">·</span>
          <span className="text-muted-foreground/50">·</span>
          <span className="text-muted-foreground/50">·</span>

          <div className="absolute bottom-full mb-2 flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             {socialLinks.map((social) => (
                <Button key={social.name} asChild variant="ghost" size="icon" className="w-8 h-8">
                    <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name}>
                        <social.icon className="h-4 w-4 text-foreground" />
                    </a>
                </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
