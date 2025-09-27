import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function table(site: string | undefined, base: string) {
  return site === 'commercial' ? `commercial_${base}` : base;
}

export async function POST(req: NextRequest) {
  try {
  const { id, featured, hero, site } = await req.json();
    if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 });

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const admin = createClient(url, key);

    // Update featured flag if provided
    if (typeof featured === 'boolean') {
      const { error } = await admin.from(table(site, 'portfolio_images')).update({ is_featured: featured }).eq('id', id);
      if (error) return NextResponse.json({ message: 'Update featured failed', error: error.message }, { status: 500 });
    }

    // If hero = true, unset hero on others and set setting
    if (hero === true) {
      const imagesTable = table(site, 'portfolio_images');
      const settingsTable = table(site, 'site_settings');
      
      // Clear previous hero
      await admin.from(imagesTable).update({ is_hero: false }).neq('id', id);
      
      // Set new hero
      const { error } = await admin.from(imagesTable).update({ is_hero: true }).eq('id', id);
      if (error) return NextResponse.json({ message: 'Update hero failed', error: error.message }, { status: 500 });
      
      // Update settings table
      const { error: settingError } = await admin.from(settingsTable).upsert({ 
        key: 'hero_image_id', 
        value: id, 
        type: 'text' 
      });
      
      if (settingError) {
        return NextResponse.json({ message: 'Update hero setting failed', error: settingError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ message: 'Invalid request', error: e?.message }, { status: 400 });
  }
}
