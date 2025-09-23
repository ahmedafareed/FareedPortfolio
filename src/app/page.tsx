import HomeClient from './home-client';

interface PageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default function Home({ searchParams }: PageProps) {
    return <HomeClient searchParams={searchParams} />;
}