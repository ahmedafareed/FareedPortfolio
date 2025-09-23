import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Instagram, Linkedin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact | Ahmed Fareed',
  description: 'Get in touch with Ahmed Fareed for bookings, collaborations, or inquiries.',
};

const socialLinks = [
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
]

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-lg text-center animate-in fade-in-0 duration-500">
        <CardHeader>
          <CardTitle className="font-headline text-4xl md:text-5xl">Get In Touch</CardTitle>
          <CardDescription className="text-lg pt-2">
            I'm available for new projects and collaborations. Let's create something beautiful together.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
                <Button asChild variant="outline" size="lg" className="w-full max-w-xs">
                    <a href="mailto:contact@ahmedfareed.com">
                        <Mail className="mr-2 h-5 w-5" />
                        contact@ahmedfareed.com
                    </a>
                </Button>
            </div>
            <div className="flex justify-center space-x-4">
                {socialLinks.map(social => (
                     <Button key={social.name} asChild variant="ghost" size="icon">
                        <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name}>
                            <social.icon className="h-6 w-6 text-muted-foreground hover:text-foreground" />
                        </a>
                    </Button>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
