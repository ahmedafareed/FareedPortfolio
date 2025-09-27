'use client';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PortfolioService, type PortfolioCategory } from '@/lib/supabase';
import { Loader2, Plus, Trash2, Save, X } from 'lucide-react';

const SITE = 'commercial';

export default function CommercialCategoriesPage() {
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const cats = await PortfolioService.getCategories(SITE);
    setCategories(cats);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await PortfolioService.createCategory({
      name,
      display_name: displayName || name,
      description: null,
      sort_order: categories.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, SITE);
    setName('');
    setDisplayName('');
    await load();
    setSaving(false);
  };

  const remove = async (id: string) => {
    setSaving(true);
    await PortfolioService.deleteCategory(id, SITE);
    await load();
    setSaving(false);
  };

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDisplayName, setEditDisplayName] = useState('');

  const startEdit = (c: PortfolioCategory) => {
    setEditingId(c.id);
    setEditName(c.name);
    setEditDisplayName(c.display_name);
  };
  const cancelEdit = () => { setEditingId(null); setEditName(''); setEditDisplayName(''); };
  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    await PortfolioService.updateCategory(editingId, { name: editName, display_name: editDisplayName }, SITE);
    await load();
    setSaving(false);
    cancelEdit();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={add} className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Input placeholder="Name (slug)" value={name} onChange={e => setName(e.target.value)} required />
            <Input placeholder="Display Name" value={displayName} onChange={e => setDisplayName(e.target.value)} />
            <div className="md:col-span-2 flex items-center">
              <Button type="submit" disabled={saving}>{saving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...</>) : (<><Plus className="mr-2 h-4 w-4"/> Add</>)}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (<p className="text-muted-foreground">Loading...</p>) : categories.length === 0 ? (
            <p className="text-muted-foreground">No categories yet.</p>
          ) : (
            <div className="space-y-2">
              {categories.map(c => {
                const isEditing = editingId === c.id;
                return (
                  <div key={c.id} className="flex flex-col md:flex-row md:items-center justify-between border rounded px-3 py-2 gap-3">
                    <div className="flex-1 space-y-1">
                      {isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <Input value={editDisplayName} onChange={e => setEditDisplayName(e.target.value)} placeholder="Display Name" />
                          <Input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Slug" />
                        </div>
                      ) : (
                        <>
                          <div className="font-medium">{c.display_name}</div>
                          <div className="text-xs text-muted-foreground">{c.name}</div>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2 justify-end">
                      {isEditing ? (
                        <>
                          <Button size="sm" variant="secondary" onClick={saveEdit} disabled={saving}>
                            {saving ? <Loader2 className="h-4 w-4 animate-spin"/> : <Save className="h-4 w-4"/>}
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit} disabled={saving}>
                            <X className="h-4 w-4"/>
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" onClick={() => startEdit(c)}>Edit</Button>
                          <Button variant="destructive" size="sm" onClick={() => remove(c.id)}><Trash2 className="mr-2 h-4 w-4"/> Delete</Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
