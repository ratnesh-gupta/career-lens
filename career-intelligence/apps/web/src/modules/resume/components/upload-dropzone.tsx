import { useCallback, useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { FileUp } from "lucide-react";

import { cn } from "@/utils/cn";
import { formatFileSize } from "@/utils/format";

import { R1A_MAX_RESUME_BYTES, validateResumeFile } from "../utils/validate-resume-file";

export interface UploadDropzoneProps {
  onFileAccepted: (file: File) => void;
  disabled?: boolean;
  className?: string;
}

export function UploadDropzone({ onFileAccepted, disabled, className }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      const result = validateResumeFile(file);
      if (!result.valid) {
        setError(result.reason ?? "Invalid file");
        return;
      }
      setError(null);
      onFileAccepted(file);
    },
    [onFileAccepted],
  );

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    handleFile(e.dataTransfer.files[0]);
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    handleFile(e.target.files?.[0]);
    e.target.value = "";
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload resume PDF"
        aria-disabled={disabled}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors duration-150",
          dragOver ? "border-primary bg-primary/5" : "border-border bg-surface hover:border-primary/40",
          disabled && "pointer-events-none opacity-50",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <FileUp className="h-10 w-10 text-muted-foreground" aria-hidden />
        <p className="mt-4 text-sm font-medium text-foreground">
          Drag & drop your resume, or click to browse
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          PDF only · max {formatFileSize(R1A_MAX_RESUME_BYTES)} · text-based (not scanned images)
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="sr-only"
          disabled={disabled}
          onChange={onChange}
        />
      </div>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default UploadDropzone;
