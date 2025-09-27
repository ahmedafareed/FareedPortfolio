'use client';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PortfolioService, type PortfolioImageWithCategory, type PortfolioCategory } from '@/lib/supabase';
import { Plus, Loader2, Trash2, Star, StarOff, Crown } from 'lucide-react';

const SITE = 'commercial';

export default function CommercialPortfolioPage() {
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
      PortfolioService.getImages(undefined, SITE),
      PortfolioService.getCategories(SITE),
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
    }, SITE);
    setTitle('');
    setImageUrl('');
    setAspect('landscape');
    setCategoryId(undefined);
    await load();
    setSaving(false);
  };

  const remove = async (id: string) => {
    setSaving(true);
    await PortfolioService.deleteImage(id, SITE);
    await load();
    setSaving(false);
  };

  const setFeatured = async (id: string, featured: boolean) => {
    setSaving(true);
  const res = await fetch('/api/admin-hero', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, featured, site: SITE }) });
    if (!res.ok) console.error('Failed to update featured', await res.json().catch(() => ({})));
    await load();
    setSaving(false);
  };

  const setHero = async (id: string) => {
    setSaving(true);
  const res = await fetch('/api/admin-hero', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, hero: true, site: SITE }) });
    if (!res.ok) console.error('Failed to set hero', await res.json().catch(() => ({})));
    await load();
    setSaving(false);
  };

  async function downscaleImage(file: File) {
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
          if (ctx) { ctx.drawImage(img, 0, 0, canvas.width, canvas.height); }
          canvas.toBlob((blob) => {
            if (!blob) return resolve(file);
            if (blob.size > 1024 * 1024) {
              canvas.toBlob((blob2) => { resolve(new File([blob2!], file.name, { type: 'image/jpeg' })); }, 'image/jpeg', 0.7);
            } else {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            }
          }, 'image/jpeg', 0.85);
        };
        img.src = (e?.target as FileReader | null)?.result as string;
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
  form.append('site', SITE);

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
                {categories.map(c => (<SelectItem key={c.id} value={c.id}>{c.display_name}</SelectItem>))}
              </SelectContent>
            </Select>
            <Button type="submit" disabled={saving}>{saving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...</>) : (<><Plus className="mr-2 h-4 w-4"/> Add</>)}</Button>
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
                {categories.map(c => (<SelectItem key={c.id} value={c.id}>{c.display_name}</SelectItem>))}
              </SelectContent>
            </Select>
            <Input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} />
            <Button type="submit" disabled={uploading || !files || files.length === 0}>{uploading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Uploading...</>) : (<><Plus className="mr-2 h-4 w-4"/> Upload</>)}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (<p className="mb-3 text-sm text-red-600" role="alert">{error}</p>)}
          {loading ? (<p className="text-muted-foreground">Loading...</p>) : images.length === 0 ? (
            <div className="text-center text-muted-foreground"><p className="mb-2">No images yet.</p><p className="text-sm">Upload images above to populate your portfolio.</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images
                .sort((a, b) => {
                  // Sort hero first, then featured, then by sort_order
                  if (a.is_hero && !b.is_hero) return -1;
                  if (!a.is_hero && b.is_hero) return 1;
                  if (a.is_featured && !b.is_featured) return -1;
                  if (!a.is_featured && b.is_featured) return 1;
                  return (a.sort_order || 0) - (b.sort_order || 0);
                })
                .map(img => (
                <div key={img.id} className="border rounded p-3 space-y-3">
                  {/* Image Preview */}
                  <div className="relative aspect-video rounded overflow-hidden bg-gray-100">
                    <img 
                      src={img.image_url} 
                      alt={img.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling!.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                      Failed to load image
                    </div>
                    {/* Hero/Featured badges */}
                    <div className="absolute top-2 left-2 flex gap-1">
                      {img.is_hero && (
                        <span className="bg-yellow-500 text-white px-2 py-1 text-xs rounded font-medium">
                          HERO
                        </span>
                      )}
                      {img.is_featured && (
                        <span className="bg-blue-500 text-white px-2 py-1 text-xs rounded font-medium">
                          FEATURED
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Image Info */}
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">{img.category?.display_name || 'Uncategorized'} · {img.aspect_ratio}</div>
                    <div className="font-medium text-sm">{img.title}</div>
                    <div className="text-xs text-muted-foreground mt-1 truncate">{img.image_url}</div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Button 
                        variant={img.is_featured ? 'secondary' : 'outline'} 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setFeatured(img.id, !img.is_featured)}
                      >
                        {img.is_featured ? (<><Star className="mr-1 h-3 w-3"/> Featured</>) : (<><StarOff className="mr-1 h-3 w-3"/> Feature</>)}
                      </Button>
                      <Button 
                        variant={img.is_hero ? 'default' : 'outline'} 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setHero(img.id)}
                        disabled={img.is_hero}
                      >
                        <Crown className="mr-1 h-3 w-3"/> {img.is_hero ? 'Hero' : 'Set Hero'}
                      </Button>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => remove(img.id)}>
                      <Trash2 className="mr-1 h-3 w-3"/> Delete
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
