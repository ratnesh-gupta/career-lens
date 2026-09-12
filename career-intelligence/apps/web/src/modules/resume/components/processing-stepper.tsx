import { Check } from "lucide-react";

import { cn } from "@/utils/cn";

const STEPS = [
  { key: "uploaded", label: "Uploaded" },
  { key: "extracting", label: "Extracting" },
  { key: "analyzing", label: "Analyzing" },
  { key: "scoring", label: "Scoring" },
  { key: "done", label: "Done" },
] as const;

export type ProcessingStepKey = (typeof STEPS)[number]["key"];

export interface ProcessingStepperProps {
  /** 0–4 index of current step (4 = done). */
  currentIndex: number;
  className?: string;
}

export function mapStatusToStepIndex(status: string, progress: number): number {
  if (status === "analyzed") return 4;
  if (status === "failed") return Math.min(3, Math.floor(progress / 25));
  if (status === "pending") return 0;
  if (status === "uploading") return 0;
  if (status === "processing") {
    if (progress < 30) return 1;
    if (progress < 60) return 2;
    return 3;
  }
  return 0;
}

export function ProcessingStepper({ currentIndex, className }: ProcessingStepperProps) {
  return (
    <ol className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", className)}>
      {STEPS.map((step, index) => {
        const done = index < currentIndex;
        const active = index === currentIndex;
        return (
          <li key={step.key} className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold",
                done && "bg-success text-white",
                active && !done && "bg-primary text-primary-foreground",
                !done && !active && "bg-muted text-muted-foreground",
              )}
              aria-current={active ? "step" : undefined}
            >
              {done ? <Check className="h-4 w-4" aria-hidden /> : index + 1}
            </span>
            <span
              className={cn(
                "text-sm",
                active || done ? "font-medium text-foreground" : "text-muted-foreground",
              )}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default ProcessingStepper;
