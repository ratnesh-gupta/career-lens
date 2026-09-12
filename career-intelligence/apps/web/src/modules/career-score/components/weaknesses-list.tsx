import type { Weakness } from "@careerlens/shared-types";

export interface WeaknessesListProps {
  items: Weakness[];
}

export function WeaknessesList({ items }: WeaknessesListProps) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No gaps listed.</p>;
  }
  return (
    <ul className="space-y-4">
      {items.map((w) => (
        <li key={w.id} className="rounded-lg border border-border bg-surface p-4">
          <p className="font-medium text-foreground">{w.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{w.description}</p>
          <p className="mt-2 text-xs text-muted-foreground">{w.improvementPath}</p>
        </li>
      ))}
    </ul>
  );
}

export default WeaknessesList;
