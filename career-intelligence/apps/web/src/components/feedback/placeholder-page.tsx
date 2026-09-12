interface PlaceholderPageProps {
  title: string;
  description?: string;
}

/** Lightweight page stub used until real UI is built in later steps. */
export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-background px-6 text-center">
      <p className="text-xs font-mono uppercase tracking-widest text-primary">Step 3 placeholder</p>
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      {description ? (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

export default PlaceholderPage;
