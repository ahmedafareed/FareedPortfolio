'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PortfolioService, type PortfolioCategory } from "@/lib/supabase";
import { Plus, Loader2, Trash2 } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await PortfolioService.getCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await PortfolioService.createCategory({ name, display_name: displayName, description: null, sort_order: (categories.length + 1) });
    setName('');
    setDisplayName('');
    await load();
    setSaving(false);
  };

  const remove = async (id: string) => {
    setSaving(true);
    await PortfolioService.deleteCategory(id);
    await load();
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline">Manage Categories</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addCategory} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input placeholder="name (e.g. weddings)" value={name} onChange={e => setName(e.target.value)} required />
            <Input placeholder="Display Name (e.g. Weddings)" value={displayName} onChange={e => setDisplayName(e.target.value)} required />
            <Button type="submit" disabled={saving}>
              {saving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...</>) : (<><Plus className="mr-2 h-4 w-4"/> Add</>)}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : categories.length === 0 ? (
            <p className="text-muted-foreground">No categories yet.</p>
          ) : (
            <div className="space-y-2">
              {categories.map(cat => (
                <div key={cat.id} className="flex items-center justify-between border rounded p-2">
                  <div>
                    <div className="font-medium">{cat.display_name}</div>
                    <div className="text-xs text-muted-foreground">{cat.name}</div>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => remove(cat.id)}>
                    <Trash2 className="mr-2 h-4 w-4"/> Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
