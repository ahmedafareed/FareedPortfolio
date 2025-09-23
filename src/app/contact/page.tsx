import type { Metadata } from 'next';
import Image from 'next/image';
import { Instagram, Linkedin, Mail } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { ContactForm } from '@/components/contact-form';

export const metadata: Metadata = {
  title: 'Contact | Ahmed Fareed',
  description: 'Get in touch with Ahmed Fareed for bookings, collaborations, or inquiries.',
};

const socialLinks = [
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
];

export default function ContactPage() {
  const contactImage = PlaceHolderImages.find(p => p.id === 'portfolio-portrait-2');

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="p-8 md:p-16 lg:p-24 flex flex-col justify-center">
        <div className="max-w-md">
            <h1 className="font-headline text-4xl md:text-5xl mb-4">Get in Touch</h1>
            <p className="text-muted-foreground mb-12">
                Have a project in mind? I'd love to hear from you. Fill out the form or email me directly.
            </p>
            <ContactForm />
            <div className="mt-12">
                <a href="mailto:contact@ahmedfareed.com" className="flex items-center group">
                    <Mail className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-sm font-body group-hover:text-primary transition-colors">contact@ahmedfareed.com</span>
                </a>
                <div className="flex mt-4 space-x-4">
                    {socialLinks.map((social) => (
                        <Button key={social.name} asChild variant="ghost" size="icon" className="w-8 h-8">
                            <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name}>
                                <social.icon className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                            </a>
                        </Button>
                    ))}
                </div>
            </div>
        </div>
      </div>
      <div className="relative hidden md:block">
        {contactImage && (
            <Image
                src={contactImage.imageUrl}
                alt={contactImage.description}
                fill
                className="object-cover"
                data-ai-hint={contactImage.imageHint}
                priority
            />
        )}
      </div>
    </div>
  );
}
