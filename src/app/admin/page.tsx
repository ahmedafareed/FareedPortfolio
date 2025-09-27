import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { headers } from 'next/headers';
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminPage() {
    const h = await headers();
    const site = h.get('x-site-key') || 'travel';
    return (
    <div>
                <h1 className="text-3xl font-headline mb-2">Admin Panel</h1>
                <p className="text-sm text-muted-foreground mb-6">Active site: <span className="font-mono">{site}</span></p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Manage Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">Upload, edit, and categorize your portfolio images.</p>
                    <Button asChild>
                        <Link href="/admin/portfolio">Go to Portfolio</Link>
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Manage Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">Create and organize portfolio categories.</p>
                    <Button asChild variant="outline">
                        <Link href="/admin/categories">Go to Categories</Link>
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Manage Awards</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">Add or update your awards and recognitions.</p>
                    <Button asChild>
                        <Link href="/admin/awards">Go to Awards</Link>
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Manage Exhibitions</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">Add or update your exhibitions and shows.</p>
                    <Button asChild variant="outline">
                        <Link href="/admin/exhibitions">Go to Exhibitions</Link>
                    </Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Site Settings</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">Control global settings like the homepage hero image.</p>
                     <Button asChild>
                        <Link href="/admin/settings">Go to Settings</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
