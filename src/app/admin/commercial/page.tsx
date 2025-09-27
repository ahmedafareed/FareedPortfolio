'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function CommercialAdminIndex() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline">Commercial Admin</h1>
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Create and organize portfolio categories for commercial site.</p>
            <Link href="/admin/commercial/categories" className="underline text-sm">Open</Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Manage commercial images & hero/featured flags.</p>
            <Link href="/admin/commercial/portfolio" className="underline text-sm">Open</Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Awards</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Add or edit awards (commercial site).</p>
            <Link href="/admin/commercial/awards" className="underline text-sm">Open</Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Exhibitions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Manage exhibitions for commercial site.</p>
            <Link href="/admin/commercial/exhibitions" className="underline text-sm">Open</Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Site tagline, contact email, hero image.</p>
            <Link href="/admin/commercial/settings" className="underline text-sm">Open</Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
