'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Award, Trophy } from "lucide-react";

export default function AdminAwardsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline">Manage Awards</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Award
        </Button>
      </div>

      <Card className="text-center py-12">
        <CardContent>
          <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Awards Management</h3>
          <p className="text-muted-foreground mb-4">
            Manage your awards and exhibitions here.
          </p>
          <p className="text-sm text-muted-foreground">
            Connect to Supabase to start managing awards.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
