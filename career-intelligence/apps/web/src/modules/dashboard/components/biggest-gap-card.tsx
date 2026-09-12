import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Weakness } from "@careerlens/shared-types";

interface BiggestGapCardProps {
  gap: Weakness | null;
}

export function BiggestGapCard({ gap }: BiggestGapCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Biggest gap</CardTitle>
      </CardHeader>
      <CardContent>
        {gap ? (
          <>
            <p className="font-medium text-foreground">{gap.title}</p>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{gap.description}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Available after your first score.</p>
        )}
      </CardContent>
    </Card>
  );
}
