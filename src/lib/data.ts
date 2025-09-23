import { PlaceHolderImages } from './placeholder-images';

export type PortfolioCategory = 'Weddings' | 'Portraits' | 'Landscapes';
export type AspectRatio = 'portrait' | 'landscape' | 'square';

export interface PortfolioImage {
  id: string;
  placeholderId: string;
  title: string;
  category: PortfolioCategory;
  aspectRatio: AspectRatio;
}

export interface Award {
  id: string;
  placeholderId: string;
  title: string;
  event: string;
  year: number;
}

export const portfolioCategories: PortfolioCategory[] = ['Weddings', 'Portraits', 'Landscapes'];

export const portfolioImages: PortfolioImage[] = [
  { id: 'p1', placeholderId: 'portfolio-landscape-1', title: 'Sunset Vows', category: 'Weddings', aspectRatio: 'landscape' },
  { id: 'p2', placeholderId: 'portfolio-portrait-1', title: 'The Look of Love', category: 'Weddings', aspectRatio: 'portrait' },
  { id: 'p3', placeholderId: 'portfolio-square-1', title: 'First Dance', category: 'Weddings', aspectRatio: 'square' },
  { id: 'p4', placeholderId: 'portfolio-landscape-2', title: 'Bridal Party', category: 'Weddings', aspectRatio: 'landscape' },
  { id: 'p5', placeholderId: 'portfolio-portrait-2', title: 'CEO Headshot', category: 'Portraits', aspectRatio: 'portrait' },
  { id: 'p6', placeholderId: 'portfolio-square-2', title: 'Family Laughter', category: 'Portraits', aspectRatio: 'square' },
  { id: 'p7', placeholderId: 'portfolio-landscape-3', title: 'Author\'s Portrait', category: 'Portraits', aspectRatio: 'landscape' },
  { id: 'p8', placeholderId: 'portfolio-portrait-3', title: 'Graduation Day', category: 'Portraits', aspectRatio: 'portrait' },
  { id: 'p9', placeholderId: 'portfolio-landscape-4', title: 'Mountain Majesty', category: 'Landscapes', aspectRatio: 'landscape' },
  { id: 'p10', placeholderId: 'portfolio-portrait-4', title: 'Forest Path', category: 'Landscapes', aspectRatio: 'portrait' },
  { id: 'p11', placeholderId: 'portfolio-square-3', title: 'Coastal Serenity', category: 'Landscapes', aspectRatio: 'square' },
  { id: 'p12', placeholderId: 'portfolio-landscape-5', title: 'Desert Dawn', category: 'Landscapes', aspectRatio: 'landscape' },
];

export const awards: Award[] = [
    { id: 'a1', placeholderId: 'award-1', title: 'Photographer of the Year', event: 'International Photo Awards', year: 2023 },
    { id: 'a2', placeholderId: 'award-2', title: 'Gold in Wedding Category', event: 'WPPI Awards', year: 2022 },
    { id: 'a3', placeholderId: 'award-3', title: 'Exhibition at The Modern', event: 'The Modern Art Gallery', year: 2021 },
    { id: 'a4', placeholderId: 'award-4', title: 'First Place, Landscapes', event: 'National Geographic Contest', year: 2020 },
];

// Helper to get full image details
export const getFullPortfolioImages = () => {
    return portfolioImages.map(pImg => {
        const placeholder = PlaceHolderImages.find(pl => pl.id === pImg.placeholderId);
        return {
            ...pImg,
            imageUrl: placeholder?.imageUrl || '',
            description: placeholder?.description || '',
            imageHint: placeholder?.imageHint || '',
            width: placeholder?.imageUrl.split('/')[5] ? parseInt(placeholder.imageUrl.split('/')[5]) : 600,
            height: placeholder?.imageUrl.split('/')[6] ? parseInt(placeholder.imageUrl.split('/')[6]) : 400,
        }
    })
}

export const getFullAwards = () => {
    return awards.map(award => {
        const placeholder = PlaceHolderImages.find(pl => pl.id === award.placeholderId);
        return {
            ...award,
            imageUrl: placeholder?.imageUrl || '',
            description: placeholder?.description || '',
            imageHint: placeholder?.imageHint || '',
        }
    })
}
