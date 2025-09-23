import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This API expects multipart/form-data with files[] and fields: title, aspect_ratio, category_id (optional)
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const title = (formData.get('title') as string) || '';
    const aspect = (formData.get('aspect_ratio') as string) as 'portrait' | 'landscape' | 'square';
    const categoryId = (formData.get('category_id') as string) || null;

    if (!files || files.length === 0) {
      return NextResponse.json({ message: 'No files uploaded' }, { status: 400 });
    }
    if (!aspect || !['portrait','landscape','square'].includes(aspect)) {
      return NextResponse.json({ message: 'Invalid aspect_ratio' }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
      return NextResponse.json({ message: 'SUPABASE_SERVICE_ROLE_KEY not configured' }, { status: 500 });
    }

    const admin = createClient(url, serviceKey);

    const bucket = 'portfolio-images';
    // Ensure bucket exists (create if missing)
    const { data: buckets } = await admin.storage.listBuckets();
    const exists = buckets?.some((b: any) => b.name === bucket);
    if (!exists) {
      await admin.storage.createBucket(bucket, { public: true });
    }
    const results: any[] = [];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const ext = file.name.split('.').pop() || 'jpg';
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const path = `${filename}`;

      const { data: up, error: upErr } = await admin.storage.from(bucket).upload(path, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: false,
      });
      if (upErr) {
        return NextResponse.json({ message: 'Upload failed', error: upErr.message }, { status: 500 });
      }

      const { data: pub } = admin.storage.from(bucket).getPublicUrl(path);
      const imageUrl = pub.publicUrl;

      const { data: inserted, error: insertErr } = await admin
        .from('portfolio_images')
        .insert({
          title: title || file.name,
          description: null,
          category_id: categoryId,
          aspect_ratio: aspect,
          image_url: imageUrl,
          storage_path: path,
          width: null,
          height: null,
          alt_text: null,
          is_featured: false,
          is_hero: false,
          sort_order: 0,
        })
        .select()
        .single();

      if (insertErr) {
        return NextResponse.json({ message: 'DB insert failed', error: insertErr.message }, { status: 500 });
      }

      results.push(inserted);
    }

    return NextResponse.json({ ok: true, images: results });
  } catch (e: any) {
    return NextResponse.json({ message: 'Invalid request', error: e?.message }, { status: 400 });
  }
}
