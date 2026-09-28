import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const site = formData.get('site') === 'travel' ? 'travel' : 'commercial';
    const title = String(formData.get('title') || 'Client logo');
    const altText = String(formData.get('alt_text') || title);
    if (!(file instanceof File)) return NextResponse.json({ message: 'No logo uploaded' }, { status: 400 });

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) return NextResponse.json({ message: 'SUPABASE_SERVICE_ROLE_KEY not configured' }, { status: 500 });
    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey);
    const bucket = 'portfolio-images';
    const extension = file.name.split('.').pop() || 'png';
    const storagePath = `client-logos/${site}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await admin.storage.from(bucket).upload(storagePath, buffer, {
      contentType: file.type || 'image/png',
      upsert: false,
    });
    if (uploadError) return NextResponse.json({ message: uploadError.message }, { status: 500 });

    const { data: publicUrl } = admin.storage.from(bucket).getPublicUrl(storagePath);
    const { data, error } = await admin.from('client_logos').insert({
      site,
      title,
      image_url: publicUrl.publicUrl,
      storage_path: storagePath,
      alt_text: altText,
    }).select().single();
    if (error) return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json({ logo: data });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message || 'Invalid request' }, { status: 400 });
  }
}