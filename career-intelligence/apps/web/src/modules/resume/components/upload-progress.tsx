import { Progress } from "@/components/ui/progress";
import { cn } from "@/utils/cn";

export interface UploadProgressProps {
  progress: number;
  label?: string;
  className?: string;
}

export function UploadProgress({ progress, label, className }: UploadProgressProps) {
  const value = Math.min(100, Math.max(0, progress));
  return (
    <div className={cn("space-y-2", className)}>
      {label ? <p className="text-sm text-muted-foreground">{label}</p> : null}
      <Progress value={value} aria-label={label ?? "Upload progress"} />
      <p className="text-xs tabular-nums text-muted-foreground">{Math.round(value)}%</p>
    </div>
  );
}

export default UploadProgress;
