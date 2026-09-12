import { useRef, useState } from "react";
import { Copy, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { env } from "@/config/env";
import { ROUTES } from "@/config/routes";
import { ScoreRing } from "@/modules/marketing/components/score-ring";
import { captureEvent, EVENTS } from "@/utils/analytics";

export interface ShareCardProps {
  score: number;
  grade: string;
  shareToken: string;
  displayName?: string;
}

export function ShareCard({ score, grade, shareToken, displayName }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const shareUrl = `${env.VITE_APP_URL.replace(/\/$/, "")}${ROUTES.PUBLIC_SCORE(shareToken)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      captureEvent(EVENTS.SCORE_SHARED, { method: "copy" });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  async function shareNative() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My CareerLens Score",
          text: `Career Score ${score} (Grade ${grade})`,
          url: shareUrl,
        });
        captureEvent(EVENTS.SCORE_SHARED, { method: "web_share" });
      } catch {
        // user cancelled
      }
    } else {
      await copyLink();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Share your score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          ref={cardRef}
          className="flex flex-col items-center rounded-xl border border-border bg-background p-6"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            CareerLens
          </p>
          {displayName ? (
            <p className="mt-1 text-sm text-foreground">{displayName}</p>
          ) : null}
          <ScoreRing score={score} size={120} className="mt-4" />
          <p className="mt-2 text-sm font-medium">Grade {grade}</p>
        </div>
        <p className="break-all text-xs text-muted-foreground">{shareUrl}</p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => void copyLink()}>
            <Copy className="mr-2 h-4 w-4" />
            {copied ? "Copied" : "Copy link"}
          </Button>
          <Button type="button" size="sm" onClick={() => void shareNative()}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ShareCard;
