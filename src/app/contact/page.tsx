import type { Metadata } from 'next';
import Image from 'next/image';
import { Instagram, Facebook, Phone, MessageCircle, Mail, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PortfolioService } from '@/lib/supabase';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'Contact | Ahmed Fareed',
  description: 'Get in touch with Ahmed Fareed for bookings, collaborations, or inquiries.',
};

const contactMethods = [
    { 
        name: 'Email', 
        href: 'mailto:ahmedamfareed@gmail.com', 
        icon: Mail, 
        label: 'ahmedamfareed@gmail.com',
        description: 'Drop me a line'
    },
    { 
        name: 'WhatsApp', 
        href: 'https://wa.me/201280021316', 
        icon: MessageCircle, 
        label: 'WhatsApp Chat',
        description: 'Quick message'
    },
    { 
        name: 'Phone', 
        href: 'tel:+201280021316', 
        icon: Phone, 
        label: '+20 128 002 1316',
        description: 'Call directly'
    },
    { 
        name: 'Instagram', 
        href: 'https://instagram.com/fareedph', 
        icon: Instagram, 
        label: '@fareedph',
        description: 'Follow my work'
    },
    { 
        name: 'Facebook', 
        href: 'https://facebook.com/ahmadafareed/', 
        icon: Facebook, 
        label: 'Ahmed Fareed',
        description: 'Connect with me'
    },
];

export default async function ContactPage() {
  const h = await headers();
  const site = (h.get('x-site-key') === 'commercial') ? 'commercial' : 'travel';
  const featured = await PortfolioService.getFeaturedImages(site);
  const contactImage = featured[0];

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="p-8 md:p-16 lg:p-24 flex flex-col justify-center">
        <div className="max-w-lg">
            <h1 className="font-headline text-4xl md:text-5xl mb-4">Let's Connect</h1>
            <p className="text-muted-foreground mb-12 text-lg">
                Ready to work together? Choose your preferred way to get in touch.
            </p>
            
            <div className="space-y-6">
                {contactMethods.map((method) => (
                    <a 
                        key={method.name}
                        href={method.href} 
                        target={method.href.startsWith('http') ? '_blank' : undefined}
                        rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="group flex items-center gap-4 p-6 border border-border rounded-lg hover:border-primary/20 hover:bg-accent/50 transition-all duration-300"
                    >
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <method.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                {method.name}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-1">
                                {method.description}
                            </p>
                            <p className="text-foreground font-medium">
                                {method.label}
                            </p>
                        </div>
                        <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                ))}
            </div>
            
            <div className="mt-12 p-6 bg-accent/20 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground text-center">
                    <strong>Response Time:</strong> Usually within 24 hours
                </p>
            </div>
        </div>
      </div>
      
      <div className="relative hidden lg:block">
        {contactImage && (
            <Image
                src={contactImage.image_url}
                alt={contactImage.description || ''}
                fill
                className="object-cover"
                data-ai-hint={contactImage.alt_text || ''}
                priority
            />
        )}
      </div>
    </div>
  );
}
