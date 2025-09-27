import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Copies awards & exhibitions from travel tables into commercial_* tables.
// Body: { resource: 'awards' | 'exhibitions', mode?: 'append' | 'replace' }
// - append: only inserts rows whose id doesn't exist yet in destination
// - replace: truncates destination table first then inserts all

export async function POST(req: NextRequest) {
  try {
    const { resource, mode } = await req.json();
    if (!['awards','exhibitions'].includes(resource)) {
      return NextResponse.json({ message: 'Invalid resource' }, { status: 400 });
    }
    const action = mode === 'replace' ? 'replace' : 'append';

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const admin = createClient(url, key);

    const srcTable = resource;
    const destTable = `commercial_${resource}`;

    // Fetch source rows
    const { data: sourceRows, error: srcErr } = await admin.from(srcTable).select('*');
    if (srcErr) return NextResponse.json({ message: 'Source fetch failed', error: srcErr.message }, { status: 500 });

    if (!sourceRows || sourceRows.length === 0) {
      return NextResponse.json({ ok: true, imported: 0, note: 'No source rows' });
    }

    if (action === 'replace') {
      const { error: delErr } = await admin.from(destTable).delete().neq('id', '');
      if (delErr) return NextResponse.json({ message: 'Destination clear failed', error: delErr.message }, { status: 500 });
    }

    // Existing IDs in destination to avoid duplicates when appending
    let existingIds: Set<string> = new Set();
    if (action === 'append') {
      const { data: existing, error: existErr } = await admin.from(destTable).select('id');
      if (existErr) return NextResponse.json({ message: 'Existing fetch failed', error: existErr.message }, { status: 500 });
      existingIds = new Set((existing || []).map(r => r.id));
    }

    const rowsToInsert = sourceRows.filter(r => !existingIds.has(r.id)).map(r => ({ ...r }));
    if (rowsToInsert.length === 0) {
      return NextResponse.json({ ok: true, imported: 0, note: 'Nothing new to insert' });
    }

    // Insert in chunks to avoid payload size issues
    const chunkSize = 500;
    for (let i = 0; i < rowsToInsert.length; i += chunkSize) {
      const chunk = rowsToInsert.slice(i, i + chunkSize);
      const { error: insErr } = await admin.from(destTable).insert(chunk as any);
      if (insErr) return NextResponse.json({ message: 'Insert failed', error: insErr.message, inserted: i }, { status: 500 });
    }

    return NextResponse.json({ ok: true, imported: rowsToInsert.length, mode: action });
  } catch (e: any) {
    return NextResponse.json({ message: 'Invalid request', error: e?.message }, { status: 400 });
  }
}
