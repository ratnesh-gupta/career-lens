import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Strength } from "@careerlens/shared-types";

interface TopStrengthCardProps {
  strength: Strength | null;
}

export function TopStrengthCard({ strength }: TopStrengthCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top strength</CardTitle>
      </CardHeader>
      <CardContent>
        {strength ? (
          <>
            <p className="font-medium text-foreground">{strength.title}</p>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
              {strength.description}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Available after your first score.</p>
        )}
      </CardContent>
    </Card>
  );
}
