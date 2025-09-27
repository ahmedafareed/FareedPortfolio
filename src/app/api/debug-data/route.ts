import { NextRequest, NextResponse } from 'next/server';
import { PortfolioService } from '@/lib/supabase-service';

export async function GET(request: NextRequest) {
  try {
    // Check both travel and commercial data
    const [
      travelAwards,
      travelExhibitions, 
      commercialAwards,
      commercialExhibitions
    ] = await Promise.all([
      PortfolioService.getAwards('travel'),
      PortfolioService.getExhibitions('travel'),
      PortfolioService.getAwards('commercial'),
      PortfolioService.getExhibitions('commercial')
    ]);

    return NextResponse.json({
      travel: {
        awards: travelAwards?.length || 0,
        exhibitions: travelExhibitions?.length || 0,
        awardsData: travelAwards,
        exhibitionsData: travelExhibitions
      },
      commercial: {
        awards: commercialAwards?.length || 0,
        exhibitions: commercialExhibitions?.length || 0,
        awardsData: commercialAwards,
        exhibitionsData: commercialExhibitions
      }
    });
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}