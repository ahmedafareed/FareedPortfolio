import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const { id, featured, hero } = await req.json();
    if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 });

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const admin = createClient(url, key);

    // Update featured flag if provided
    if (typeof featured === 'boolean') {
      const { error } = await admin.from('portfolio_images').update({ is_featured: featured }).eq('id', id);
      if (error) return NextResponse.json({ message: 'Update featured failed', error: error.message }, { status: 500 });
    }

    // If hero = true, unset hero on others and set setting
    if (hero === true) {
      await admin.from('portfolio_images').update({ is_hero: false }).neq('id', id);
      const { error } = await admin.from('portfolio_images').update({ is_hero: true }).eq('id', id);
      if (error) return NextResponse.json({ message: 'Update hero failed', error: error.message }, { status: 500 });
      await admin.from('site_settings').upsert({ key: 'hero_image_id', value: id, type: 'text' });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ message: 'Invalid request', error: e?.message }, { status: 400 });
  }
}
