import { useState } from "react";

import { useAuth } from "@/modules/auth/hooks/use-auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AccountSettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.displayName ?? "");
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // Profile update API wired in a later step; local feedback only for now.
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
          <CardDescription>Update how your name appears across CareerLens.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="max-w-md space-y-4">
            {saved ? (
              <Alert>
                <AlertDescription>Changes saved (local preview).</AlertDescription>
              </Alert>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="displayName">Display name</Label>
              <Input
                id="displayName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email ?? ""} disabled />
              <p className="text-xs text-muted-foreground">Email changes require verification.</p>
            </div>
            <Button type="submit" size="sm">
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Password</CardTitle>
          <CardDescription>Change your password using the reset flow.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button type="button" variant="outline" size="sm" disabled>
            Change password (coming soon)
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Delete account</CardTitle>
          <CardDescription>
            Permanently delete your account and associated data. This cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button type="button" variant="destructive" size="sm" disabled>
            Delete account (coming soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
