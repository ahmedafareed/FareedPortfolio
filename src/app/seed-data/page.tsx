'use client';

import { useState } from 'react';
import { PortfolioService } from '@/lib/supabase-service';

export default function DataSeeder() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const seedData = async () => {
    setLoading(true);
    setResult('Seeding data...');
    
    try {
      // Travel awards
      const travelAwards = [
        { title: 'Gold Medal', event: 'National Geographic Photography Contest', year: 2024, category: 'Travel' },
        { title: 'Best Portfolio', event: 'World Photography Awards', year: 2023, category: 'Nature' },
        { title: 'Photographer of the Year', event: 'Travel + Leisure Awards', year: 2023, category: 'Travel' },
      ];

      // Commercial awards
      const commercialAwards = [
        { title: 'Commercial Excellence', event: 'Professional Photographers Awards', year: 2024, category: 'Commercial' },
        { title: 'Creative Vision Award', event: 'Advertising Photography Guild', year: 2023, category: 'Advertising' },
      ];

      // Travel exhibitions
      const travelExhibitions = [
        { title: 'Wanderlust: A Journey Through Landscapes', venue: 'Gallery One', location: 'New York', year: 2024, month: '6' },
        { title: 'Cultural Connections', venue: 'International Photo Center', location: 'Paris', year: 2023, month: '9' },
      ];

      // Commercial exhibitions
      const commercialExhibitions = [
        { title: 'Brand Stories: Commercial Photography', venue: 'Modern Art Museum', location: 'London', year: 2024, month: '3' },
        { title: 'Visual Impact: Advertising Arts', venue: 'Creative Space Gallery', location: 'Tokyo', year: 2023, month: '11' },
      ];

      // Seed travel data
      for (const award of travelAwards) {
        await PortfolioService.createAward(award, 'travel');
      }
      
      for (const exhibition of travelExhibitions) {
        await PortfolioService.createExhibition(exhibition, 'travel');
      }

      // Seed commercial data
      for (const award of commercialAwards) {
        await PortfolioService.createAward(award, 'commercial');
      }
      
      for (const exhibition of commercialExhibitions) {
        await PortfolioService.createExhibition(exhibition, 'commercial');
      }

      setResult('✅ Data seeded successfully! Refresh the homepage to see the results.');
    } catch (error) {
      console.error('Error seeding data:', error);
      setResult(`❌ Error: ${String(error)}`);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Data Seeder</h1>
      <p className="text-gray-600 mb-4">
        This will create sample awards and exhibitions data for both travel and commercial sites.
      </p>
      <button 
        onClick={seedData}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Seeding...' : 'Seed Sample Data'}
      </button>
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="whitespace-pre-wrap">{result}</p>
        </div>
      )}
    </div>
  );
}