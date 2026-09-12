import type { Strength } from "@careerlens/shared-types";

export interface StrengthsListProps {
  items: Strength[];
}

export function StrengthsList({ items }: StrengthsListProps) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No strengths listed.</p>;
  }
  return (
    <ul className="space-y-4">
      {items.map((s) => (
        <li key={s.id} className="rounded-lg border border-border bg-surface p-4">
          <p className="font-medium text-foreground">{s.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
          <p className="mt-2 text-xs capitalize text-primary">Market value: {s.marketValue}</p>
        </li>
      ))}
    </ul>
  );
}

export default StrengthsList;
