import type { Metadata } from 'next';
import AwardsList from '@/components/awards-list';

export const metadata: Metadata = {
  title: 'Awards & Exhibitions | Ahmed Fareed',
  description: 'A showcase of awards, recognitions, and exhibitions by photographer Ahmed Fareed.',
};

export default function AwardsPage() {
    return (
        <div className="container mx-auto px-4 py-16 sm:py-24 min-h-screen flex justify-center">
            <div className="w-full max-w-4xl">
                <AwardsList />
            </div>
        </div>
    );
}
