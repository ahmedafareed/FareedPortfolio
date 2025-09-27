'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PortfolioService, type Exhibition } from '@/lib/supabase';
import PortfolioImagePicker from '@/components/ui/portfolio-image-picker';
import { Plus, Loader2, Trash2, Download } from 'lucide-react';

const SITE = 'commercial';

export default function CommercialExhibitionsPage() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [title, setTitle] = useState('');
  const [venue, setVenue] = useState('');
  const [location, setLocation] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await PortfolioService.getExhibitions(SITE);
    setExhibitions(data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const addExhibition = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const maxSortOrder = exhibitions.length > 0 ? Math.max(...exhibitions.map(e => e.sort_order || 0)) : 0;
    await PortfolioService.createExhibition({
      title,
      venue,
      location,
      year,
      month: month.toString(),
      description: description || null,
      image_url: imageUrl || null,
      storage_path: null,
      sort_order: maxSortOrder + 1
    }, SITE);
    setTitle('');
    setVenue('');
    setLocation('');
    setYear(new Date().getFullYear());
    setMonth(new Date().getMonth() + 1);
    setDescription('');
    setImageUrl('');
    await load();
    setSaving(false);
  };

  const remove = async (id: string) => {
    setSaving(true);
    await PortfolioService.deleteExhibition(id, SITE);
    await load();
    setSaving(false);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-3xl font-headline">Commercial Exhibitions</h1>
        <ImportButtons />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Add Exhibition</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addExhibition} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Exhibition Title" value={title} onChange={e => setTitle(e.target.value)} required />
              <Input placeholder="Venue" value={venue} onChange={e => setVenue(e.target.value)} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input placeholder="Location (City, Country)" value={location} onChange={e => setLocation(e.target.value)} required />
              <Input type="number" placeholder="Year" value={year} onChange={e => setYear(parseInt(e.target.value || '0', 10))} required />
              <select value={month} onChange={e => setMonth(parseInt(e.target.value, 10))} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                {monthNames.map((name, index) => (<option key={index + 1} value={index + 1}>{name}</option>))}
              </select>
            </div>
            <Textarea placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
            <div className="space-y-2">
              <label className="text-sm font-medium">Exhibition Image (optional)</label>
              <PortfolioImagePicker value={imageUrl} onChange={setImageUrl} />
            </div>
            <Button type="submit" disabled={saving}>{saving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Adding...</>) : (<><Plus className="mr-2 h-4 w-4"/> Add Exhibition</>)}</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Exhibitions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (<p className="text-muted-foreground">Loading...</p>) : exhibitions.length === 0 ? (<p className="text-muted-foreground">No exhibitions yet.</p>) : (
            <div className="space-y-3">
              {exhibitions.map(exhibition => (
                <div key={exhibition.id} className="flex items-start justify-between border rounded p-4">
                  <div className="flex space-x-4 flex-1">
                    {exhibition.image_url && (<img src={exhibition.image_url} alt={exhibition.title} className="w-16 h-16 object-cover rounded" />)}
                    <div className="flex-1">
                      <div className="font-medium text-lg">{exhibition.title}</div>
                      <div className="text-sm text-muted-foreground mb-1">{exhibition.venue} • {exhibition.location}</div>
                      <div className="text-sm text-muted-foreground mb-2">{monthNames[((exhibition.month ? parseInt(exhibition.month as any, 10) : 1) - 1)]} {exhibition.year}</div>
                      {exhibition.description && (<div className="text-sm text-gray-600 mt-2">{exhibition.description}</div>)}
                    </div>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => remove(exhibition.id)} disabled={saving}><Trash2 className="mr-2 h-4 w-4"/> Delete</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ImportButtons() {
  const [importingAwards, setImportingAwards] = useState(false);
  const [importingExhibitions, setImportingExhibitions] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const runImport = async (resource: 'awards' | 'exhibitions') => {
    if (resource === 'awards') setImportingAwards(true); else setImportingExhibitions(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin-import', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resource, mode: 'append' }) });
      const data = await res.json();
      if (res.ok) {
        setMessage(`${resource} import: imported ${data.imported}`);
      } else {
        setMessage(data.message || 'Import failed');
      }
    } catch (e: any) {
      setMessage(e?.message || 'Import error');
    } finally {
      if (resource === 'awards') setImportingAwards(false); else setImportingExhibitions(false);
    }
  };

  return (
    <div className="flex flex-col items-stretch md:items-end gap-2">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={importingAwards} onClick={() => runImport('awards')}>
          {importingAwards ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Download className="mr-2 h-4 w-4"/>}
          Import Travel Awards
        </Button>
        <Button variant="outline" size="sm" disabled={importingExhibitions} onClick={() => runImport('exhibitions')}>
          {importingExhibitions ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Download className="mr-2 h-4 w-4"/>}
          Import Travel Exhibitions
        </Button>
      </div>
      {message && <p className="text-xs text-muted-foreground">{message}</p>}
    </div>
  );
}
