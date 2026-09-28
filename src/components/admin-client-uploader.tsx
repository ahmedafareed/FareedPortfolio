'use client';

import { useEffect, useState } from 'react';
import { PortfolioService, type ClientLogo } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function AdminClientUploader({ site }: { site: 'travel' | 'commercial' }) {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      setLogos(await PortfolioService.getClientLogos(site));
    })();
  }, [site]);

  const upload = async () => {
    if (!files?.length) return;
    setSaving(true);
    const uploaded: ClientLogo[] = [];
    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append('file', file);
      form.append('title', file.name.replace(/\.[^.]+$/, ''));
      form.append('site', site);
      const response = await fetch('/api/admin-client-logo', { method: 'POST', body: form });
      if (response.ok) uploaded.push((await response.json()).logo);
    }
    setLogos(current => [...current, ...uploaded]);
    setFiles(null);
    setSaving(false);
  };

  return <Card>
    <CardHeader><CardTitle>Selected clients and publications</CardTitle></CardHeader>
    <CardContent className="space-y-4">
      <p className="text-sm text-muted-foreground">Upload logo artwork for the commercial homepage client row.</p>
      <div className="flex flex-wrap gap-3"><input type="file" accept="image/*" multiple onChange={event => setFiles(event.target.files)} /><Button type="button" onClick={upload} disabled={saving || !files?.length}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Upload logos'}</Button></div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{logos.map(logo => <div key={logo.id} className="relative aspect-video overflow-hidden border border-border p-2"><img src={logo.image_url} alt={logo.alt_text || logo.title} className="h-full w-full object-contain" loading="lazy" /><span className="absolute inset-x-2 bottom-2 bg-paper/90 px-1 text-[10px]">{logo.title}</span></div>)}</div>
    </CardContent>
  </Card>;
}