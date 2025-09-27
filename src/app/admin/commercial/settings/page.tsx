'use client';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PortfolioService } from '@/lib/supabase';
import { getSiteStats, addSiteStat, updateSiteStat, deleteSiteStat, SiteStat } from '@/lib/supabase-service';
import { Loader2 } from 'lucide-react';


const SITE = 'commercial';

interface SettingField {
  key: string;
  label: string;
  type: 'text' | 'textarea';
  placeholder?: string;
}

const FIELDS: SettingField[] = [
  { key: 'hero_tagline', label: 'Hero Tagline', type: 'text', placeholder: 'A concise tagline' },
  { key: 'about_bio', label: 'About Bio', type: 'textarea', placeholder: 'Short biography' },
  { key: 'contact_email', label: 'Contact Email', type: 'text', placeholder: 'name@example.com' },
  { key: 'instagram_url', label: 'Instagram URL', type: 'text' },
  { key: 'linkedin_url', label: 'LinkedIn URL', type: 'text' },
  { key: 'behance_url', label: 'Behance URL', type: 'text' },
];

export default function CommercialSettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState<SiteStat[]>([]);
  const [newStatLabel, setNewStatLabel] = useState('');
  const [newStatValue, setNewStatValue] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const settings = await PortfolioService.getSettings(SITE);
      const map: Record<string, string> = {};
      settings.forEach(s => { map[s.key] = s.value || ''; });
      setValues(map);
      const statsData = await getSiteStats(SITE);
      setStats(statsData);
      setLoading(false);
    })();
  }, []);

  const save = async (key: string) => {
    setSaving(true);
    await PortfolioService.setSetting(key, values[key] || '', SITE);
    setSaving(false);
  };

  const saveAll = async () => {
    setSaving(true);
    for (const f of FIELDS) {
      await PortfolioService.setSetting(f.key, values[f.key] || '', SITE);
    }
    setSaving(false);
  };

  // --- Stats CRUD handlers ---
  const handleAddStat = async () => {
    if (!newStatLabel || !newStatValue) return;
    const stat = await addSiteStat(SITE, newStatLabel, parseInt(newStatValue, 10), stats.length + 1);
    if (stat) {
      setStats([...stats, stat]);
      setNewStatLabel('');
      setNewStatValue('');
    }
  };
  const handleUpdateStat = async (id: string, label: string, value: number, sort_order?: number) => {
    await updateSiteStat(id, label, value, sort_order);
    setStats(await getSiteStats(SITE));
  };
  const handleDeleteStat = async (id: string) => {
    await deleteSiteStat(id);
    setStats(await getSiteStats(SITE));
  };

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Homepage Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.map((stat, idx) => (
                <div key={stat.id} className="flex items-center gap-2">
                  <input
                    className="border rounded px-2 py-1 w-24 text-right"
                    type="number"
                    value={stat.value}
                    onChange={e => handleUpdateStat(stat.id, stat.label, parseInt(e.target.value, 10), stat.sort_order)}
                  />
                  <input
                    className="border rounded px-2 py-1 flex-1"
                    type="text"
                    value={stat.label}
                    onChange={e => handleUpdateStat(stat.id, e.target.value, stat.value, stat.sort_order)}
                  />
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteStat(stat.id)}>Delete</Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <input
                className="border rounded px-2 py-1 w-24 text-right"
                type="number"
                placeholder="Value"
                value={newStatValue}
                onChange={e => setNewStatValue(e.target.value)}
              />
              <input
                className="border rounded px-2 py-1 flex-1"
                type="text"
                placeholder="Label"
                value={newStatLabel}
                onChange={e => setNewStatLabel(e.target.value)}
              />
              <Button size="sm" onClick={handleAddStat}>Add</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Commercial Site Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {FIELDS.map(field => (
            <div key={field.key} className="space-y-2">
              <label className="text-sm font-medium">{field.label}</label>
              {field.type === 'text' ? (
                <Input
                  value={values[field.key] || ''}
                  onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                />
              ) : (
                <Textarea
                  value={values[field.key] || ''}
                  onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  rows={4}
                />
              )}
              <div>
                <Button size="sm" onClick={() => save(field.key)} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Save Field'}</Button>
              </div>
            </div>
          ))}
          <div>
            <Button onClick={saveAll} disabled={saving}>{saving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...</>) : 'Save All'}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
