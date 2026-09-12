import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ActivityItem {
  id: string;
  label: string;
  time: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity yet.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-4 text-sm">
                <span className="text-foreground">{item.label}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
