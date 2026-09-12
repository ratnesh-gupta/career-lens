import { getPasswordStrength } from "@/utils/validation";
import { cn } from "@/utils/cn";

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

const LABELS = {
  weak: "Weak",
  fair: "Fair",
  strong: "Strong",
} as const;

const BAR_CLASS = {
  weak: "bg-danger w-1/3",
  fair: "bg-warning w-2/3",
  strong: "bg-success w-full",
} as const;

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  if (!password) return null;

  const strength = getPasswordStrength(password);

  return (
    <div className={cn("space-y-1.5", className)} aria-live="polite">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all duration-150", BAR_CLASS[strength])}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Password strength: <span className="font-medium text-foreground">{LABELS[strength]}</span>
      </p>
    </div>
  );
}

export default PasswordStrength;
