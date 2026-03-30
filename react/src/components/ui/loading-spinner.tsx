import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type LoadingSpinnerProps = {
  size?: number | string;
  label?: string;
  className?: string;
};

const LoadingSpinner = ({ size = 20, label = "Loading...", className }: LoadingSpinnerProps) => {
  const spinnerSize = typeof size === "number" ? `${size}px` : size;

  return (
    <span role="status" aria-live="polite" className={cn("inline-flex items-center justify-center", className)}>
      <Loader2
        className="animate-spin"
        style={{ width: spinnerSize, height: spinnerSize }}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
};

export default LoadingSpinner;
