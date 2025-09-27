"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PortfolioService, type PortfolioImageWithCategory, type SiteSetting } from "@/lib/supabase";
import { getSiteStats, addSiteStat, updateSiteStat, deleteSiteStat, SiteStat } from "@/lib/supabase-service";

export default function AdminSettingsPage() {
  const [images, setImages] = useState<PortfolioImageWithCategory[]>([]);
  const [heroId, setHeroId] = useState<string | undefined>(undefined);
  const [siteTagline, setSiteTagline] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [aboutDescription, setAboutDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [aboutHeadshotId, setAboutHeadshotId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SiteStat[]>([]);
  const [newStatLabel, setNewStatLabel] = useState('');
  const [newStatValue, setNewStatValue] = useState('');

  const load = async () => {
    setLoading(true);
    const [imgs, heroSetting, tagline, email, about, headshot, statsData] = await Promise.all([
      PortfolioService.getImages(),
      PortfolioService.getSetting('hero_image_id'),
      PortfolioService.getSetting('site_tagline'),
      PortfolioService.getSetting('contact_email'),
      PortfolioService.getSetting('about_description'),
      PortfolioService.getSetting('about_headshot_id'),
      getSiteStats('travel'),
    ]);
    setImages(imgs);
    setHeroId(heroSetting?.value || undefined);
    setSiteTagline(tagline?.value || '');
    setContactEmail(email?.value || '');
    setAboutDescription(about?.value || '');
    setAboutHeadshotId(headshot?.value || undefined);
    setStats(statsData);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      await Promise.all([
        PortfolioService.setSetting(
          'hero_image_id',
          heroId ? String(heroId) : '',
          'ID of the hero image for homepage',
          'image_id'
        ),
        PortfolioService.setSetting(
          'site_tagline',
          siteTagline ? siteTagline : '',
          'Tagline displayed on the site',
          'text'
        ),
        PortfolioService.setSetting(
          'contact_email',
          contactEmail ? contactEmail : '',
          'Contact email address for inquiries',
          'email'
        ),
        PortfolioService.setSetting(
          'about_description',
          aboutDescription ? aboutDescription : '',
          'Description for the About section',
          'text'
        ),
        PortfolioService.setSetting(
          'about_headshot_id',
          aboutHeadshotId ? String(aboutHeadshotId) : '',
          'ID of the headshot image for About section',
          'image_id'
        ),
      ]);
    } catch (err: any) {
      let msg = err?.message || 'Failed to save settings. See console for details.';
      if (msg.includes('Permission denied')) {
        msg = 'Permission denied: You do not have access to update site settings. Check Supabase RLS and API key.';
      } else if (msg.includes('Duplicate key')) {
        msg = 'Duplicate key: This setting already exists.';
      } else if (msg.includes('Constraint violation')) {
        msg = 'Constraint violation: One or more fields do not meet table requirements.';
      }
      setSaveError(msg);
    }
    setSaving(false);
  };

  // --- Stats CRUD handlers ---
  const handleAddStat = async () => {
    if (!newStatLabel || !newStatValue) return;
    const stat = await addSiteStat('travel', newStatLabel, parseInt(newStatValue, 10), stats.length + 1);
    if (stat) {
      setStats([...stats, stat]);
      setNewStatLabel('');
      setNewStatValue('');
    }
  };
  const handleUpdateStat = async (id: string, label: string, value: number, sort_order?: number) => {
    await updateSiteStat(id, label, value, sort_order);
    setStats(await getSiteStats('travel'));
  };
  const handleDeleteStat = async (id: string) => {
    await deleteSiteStat(id);
    setStats(await getSiteStats('travel'));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline">Site Settings</h1>
      </div>

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
          <CardTitle>Global Settings</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : (
            <form onSubmit={save} className="space-y-4">
              {saveError && (
                <div className="text-red-500 text-sm mb-2">{saveError}</div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Hero Image</label>
                <Select value={heroId} onValueChange={(v) => setHeroId(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hero image" />
                  </SelectTrigger>
                  <SelectContent>
                    {images.length === 0 ? (
                      <div className="px-2 py-1 text-sm text-muted-foreground">No images available. Upload some first.</div>
                    ) : images.map(img => (
                      <SelectItem key={img.id} value={img.id}>{img.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">About Headshot</label>
                <Select value={aboutHeadshotId} onValueChange={(v) => setAboutHeadshotId(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select about headshot (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {images.length === 0 ? (
                      <div className="px-2 py-1 text-sm text-muted-foreground">No images available.</div>
                    ) : images.map(img => (
                      <SelectItem key={img.id} value={img.id}>{img.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Site Tagline</label>
                <Input value={siteTagline} onChange={(e) => setSiteTagline(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Email</label>
                <Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">About Description</label>
                <textarea className="w-full border rounded p-2 min-h-[120px]" value={aboutDescription} onChange={(e) => setAboutDescription(e.target.value)} />
              </div>
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )};
