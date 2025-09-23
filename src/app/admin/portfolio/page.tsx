'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PortfolioService, type PortfolioImageWithCategory, type PortfolioCategory } from "@/lib/supabase";
import { Plus, Loader2, Trash2, Star, StarOff, Crown } from 'lucide-react';

export default function AdminPortfolioPage() {
  const [images, setImages] = useState<PortfolioImageWithCategory[]>([]);
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [aspect, setAspect] = useState<'portrait' | 'landscape' | 'square'>('landscape');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [imgs, cats] = await Promise.all([
      PortfolioService.getImages(),
      PortfolioService.getCategories(),
    ]);
    setImages(imgs);
    setCategories(cats);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await PortfolioService.createImage({
      title,
      image_url: imageUrl,
      description: null,
      aspect_ratio: aspect,
      category_id: categoryId || null,
      is_featured: false,
      is_hero: false,
      sort_order: images.length + 1,
      alt_text: null,
      width: null,
      height: null,
      storage_path: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      id: '' as any,
    });
    setTitle('');
    setImageUrl('');
    setAspect('landscape');
    setCategoryId(undefined);
    await load();
    setSaving(false);
  };

  const remove = async (id: string) => {
    setSaving(true);
    await PortfolioService.deleteImage(id);
    await load();
    setSaving(false);
  };

  const setFeatured = async (id: string, featured: boolean) => {
    setSaving(true);
    const res = await fetch('/api/admin-hero', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, featured }),
    });
    if (!res.ok) console.error('Failed to update featured', await res.json().catch(() => ({})));
    await load();
    setSaving(false);
  };

  const setHero = async (id: string) => {
    setSaving(true);
    const res = await fetch('/api/admin-hero', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, hero: true }),
    });
    if (!res.ok) console.error('Failed to set hero', await res.json().catch(() => ({})));
    await load();
    setSaving(false);
  };

  async function downscaleImage(file) {
    return new Promise<File>((resolve) => {
      if (file.size <= 500 * 1024) return resolve(file);
      const img = new window.Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let scale = Math.sqrt((500 * 1024) / file.size);
          scale = Math.min(scale, 1);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (!blob) return resolve(file);
            // If still >1mb, reduce quality
            if (blob.size > 1024 * 1024) {
              canvas.toBlob((blob2) => {
                resolve(new File([blob2!], file.name, { type: 'image/jpeg' }));
              }, 'image/jpeg', 0.7);
            } else {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            }
          }, 'image/jpeg', 0.85);
        };
        img.src = e.target.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  const uploadFiles = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    const form = new FormData();
    for (const f of Array.from(files)) {
      const processed = await downscaleImage(f);
      form.append('files', processed);
    }
    form.append('title', title);
    form.append('aspect_ratio', aspect);
    if (categoryId) form.append('category_id', categoryId);

    const res = await fetch('/api/admin-upload', { method: 'POST', body: form });
    if (res.ok) {
      setFiles(null);
      setTitle('');
      await load();
    } else {
      const data = await res.json().catch(() => ({ message: 'Upload failed' } as any));
      setError(data?.message || 'Upload failed');
      console.error('Upload failed', data);
    }
    setUploading(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Image (by URL)</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addImage} className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <Input placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} required />
            <Select value={aspect} onValueChange={(v: any) => setAspect(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Aspect ratio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="landscape">Landscape</SelectItem>
                <SelectItem value="portrait">Portrait</SelectItem>
                <SelectItem value="square">Square</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryId} onValueChange={(v) => setCategoryId(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Category (optional)" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.display_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" disabled={saving}>
              {saving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...</>) : (<><Plus className="mr-2 h-4 w-4"/> Add</>)}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload Images</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={uploadFiles} className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <Input placeholder="Title prefix (optional)" value={title} onChange={e => setTitle(e.target.value)} />
            <Select value={aspect} onValueChange={(v: any) => setAspect(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Aspect ratio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="landscape">Landscape</SelectItem>
                <SelectItem value="portrait">Portrait</SelectItem>
                <SelectItem value="square">Square</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryId} onValueChange={(v) => setCategoryId(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Category (optional)" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.display_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} />
            <Button type="submit" disabled={uploading || !files || files.length === 0}>
              {uploading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Uploading...</>) : (<><Plus className="mr-2 h-4 w-4"/> Upload</>)}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="mb-3 text-sm text-red-600" role="alert">{error}</p>
          )}
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : images.length === 0 ? (
            <div className="text-center text-muted-foreground">
              <p className="mb-2">No images yet.</p>
              <p className="text-sm">Upload images above to populate your portfolio.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map(img => (
                <div key={img.id} className="border rounded p-2">
                  <div className="text-sm text-muted-foreground mb-1">{img.category?.display_name || 'Uncategorized'} · {img.aspect_ratio}</div>
                  <div className="font-medium">{img.title}</div>
                  <div className="text-xs break-all text-muted-foreground mb-2">{img.image_url}</div>
                  <div className="flex gap-2 justify-end">
                    <Button variant={img.is_featured ? 'secondary' : 'outline'} size="sm" onClick={() => setFeatured(img.id, !img.is_featured)}>
                      {img.is_featured ? (<><Star className="mr-2 h-4 w-4"/> Featured</>) : (<><StarOff className="mr-2 h-4 w-4"/> Make Featured</>)}
                    </Button>
                    <Button variant={img.is_hero ? 'secondary' : 'outline'} size="sm" onClick={() => setHero(img.id)}>
                      <Crown className="mr-2 h-4 w-4"/> {img.is_hero ? 'Hero' : 'Set Hero'}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => remove(img.id)}>
                      <Trash2 className="mr-2 h-4 w-4"/> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
