import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Exhibitions | Ahmed Fareed',
  description: 'A showcase of exhibitions by photographer Ahmed Fareed.',
};

export default function ExhibitionsPage() {
  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 min-h-screen flex justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-headline mb-8">Exhibitions</h1>
        {/* TODO: Implement exhibitions list or import from awards-list if needed */}
        <p className="text-muted-foreground">Exhibitions content coming soon.</p>
      </div>
    </div>
  );
}
