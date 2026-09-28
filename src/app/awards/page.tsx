import type { Metadata } from 'next';
import AwardsList from '@/components/awards-list';
import { getRequestLocale } from '@/lib/i18n-server';
import { getDictionary } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
        const dictionary = getDictionary(await getRequestLocale());
        return { title: `${dictionary.pages.awards} | Ahmed Fareed`, description: dictionary.recognition.achievements };
}

export default function AwardsPage() {
    return (
        <div className="container mx-auto px-4 py-16 sm:py-24 min-h-screen flex justify-center">
            <div className="w-full max-w-4xl">
                <AwardsList />
            </div>
        </div>
    );
}
