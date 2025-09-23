'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Globe } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline">Site Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hero Image Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Choose which image appears as the hero on your homepage.
            </p>
            <Button variant="outline">
              Select Hero Image
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Site Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Update site tagline, contact information, and other global settings.
            </p>
            <Button variant="outline">
              Edit Site Info
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="text-center py-12">
        <CardContent>
          <Globe className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Site Settings Management</h3>
          <p className="text-muted-foreground mb-4">
            Control global site settings and configuration.
          </p>
          <p className="text-sm text-muted-foreground">
            Connect to Supabase to manage site settings.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
