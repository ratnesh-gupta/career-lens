import { useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function PrivacySettingsPage() {
  const [publicProfile, setPublicProfile] = useState(true);
  const [shareScore, setShareScore] = useState(false);
  const [exportRequested, setExportRequested] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Visibility</CardTitle>
          <CardDescription>Control what others can see about your career profile.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor="public-profile">Public profile</Label>
              <p className="text-xs text-muted-foreground">
                Allow others to view your public profile page.
              </p>
            </div>
            <input
              id="public-profile"
              type="checkbox"
              className="h-4 w-4 rounded border-input"
              checked={publicProfile}
              onChange={(e) => setPublicProfile(e.target.checked)}
            />
          </label>
          <label className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor="share-score">Share Career Score</Label>
              <p className="text-xs text-muted-foreground">
                Allow a public score card link when you choose to share.
              </p>
            </div>
            <input
              id="share-score"
              type="checkbox"
              className="h-4 w-4 rounded border-input"
              checked={shareScore}
              onChange={(e) => setShareScore(e.target.checked)}
            />
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your data</CardTitle>
          <CardDescription>Request an export of your CareerLens data.</CardDescription>
        </CardHeader>
        <CardContent>
          {exportRequested ? (
            <Alert>
              <AlertDescription>
                Export requested. You'll receive an email when it's ready (preview).
              </AlertDescription>
            </Alert>
          ) : (
            <Button type="button" variant="outline" size="sm" onClick={() => setExportRequested(true)}>
              Request data export
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
