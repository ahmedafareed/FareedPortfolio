import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminPage() {
  return (
    <div>
        <h1 className="text-3xl font-headline mb-8">Admin Panel</h1>
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
                    <CardTitle>Manage Awards</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">Add or update your awards and exhibitions.</p>
                    <Button asChild>
                        <Link href="/admin/awards">Go to Awards</Link>
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
