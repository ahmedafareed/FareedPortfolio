'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PortfolioService, type Award } from "@/lib/supabase";
import PortfolioImagePicker from '@/components/ui/portfolio-image-picker';
import { Plus, Loader2, Trash2, Edit } from "lucide-react";

export default function AdminAwardsPage() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [title, setTitle] = useState('');
  const [event, setEvent] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editEvent, setEditEvent] = useState('');
  const [editYear, setEditYear] = useState<number>(new Date().getFullYear());
  const [editImageUrl, setEditImageUrl] = useState('');

  const load = async () => {
    setLoading(true);
    const data = await PortfolioService.getAwards();
    setAwards(data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const addAward = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await PortfolioService.createAward({ 
      title, 
      event, 
      year,
      image_url: imageUrl || null
    });
    setTitle('');
    setEvent('');
    setYear(new Date().getFullYear());
    setImageUrl('');
    await load();
    setSaving(false);
  };

  const remove = async (id: string) => {
    setSaving(true);
    await PortfolioService.deleteAward(id);
    await load();
    setSaving(false);
  };

  const startEdit = (award: Award) => {
    setEditingId(award.id);
    setEditTitle(award.title);
    setEditEvent(award.event);
    setEditYear(award.year);
    setEditImageUrl(award.image_url || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditEvent('');
    setEditYear(new Date().getFullYear());
    setEditImageUrl('');
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    await PortfolioService.updateAward(id, {
      title: editTitle,
      event: editEvent,
      year: editYear,
      image_url: editImageUrl || null
    });
    setEditingId(null);
    await load();
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline">Manage Awards</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Award</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addAward} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
              <Input placeholder="Event" value={event} onChange={e => setEvent(e.target.value)} required />
              <Input type="number" placeholder="Year" value={year} onChange={e => setYear(parseInt(e.target.value || '0', 10))} required />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Award Image (optional)</label>
              <PortfolioImagePicker value={imageUrl} onChange={setImageUrl} />
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...</>) : (<><Plus className="mr-2 h-4 w-4"/> Add</>)}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Awards</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : awards.length === 0 ? (
            <p className="text-muted-foreground">No awards yet.</p>
          ) : (
            <div className="space-y-3">
              {awards.map(a => (
                <div key={a.id} className="border rounded p-4">
                  {editingId === a.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input 
                          value={editTitle} 
                          onChange={e => setEditTitle(e.target.value)} 
                          placeholder="Title"
                        />
                        <Input 
                          value={editEvent} 
                          onChange={e => setEditEvent(e.target.value)} 
                          placeholder="Event"
                        />
                        <Input 
                          type="number"
                          value={editYear} 
                          onChange={e => setEditYear(parseInt(e.target.value || '0', 10))} 
                          placeholder="Year"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Award Image (optional)</label>
                        <PortfolioImagePicker value={editImageUrl} onChange={setEditImageUrl} />
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => saveEdit(a.id)}
                          disabled={saving}
                        >
                          {saving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={cancelEdit}
                          disabled={saving}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex space-x-4 flex-1">
                        {a.image_url && (
                          <img 
                            src={a.image_url} 
                            alt={a.title} 
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <div className="font-medium">{a.title}</div>
                          <div className="text-sm text-muted-foreground">{a.event} · {a.year}</div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => startEdit(a)}
                        >
                          <Edit className="mr-2 h-4 w-4"/> Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => remove(a.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4"/> Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
