import { cn } from "@/lib/utils";

interface ChipProps {
  children: React.ReactNode;
  variant?: "default" | "green" | "bright" | "dim";
}

const chipVariants = {
  default: "bg-secondary border-border text-muted-foreground",
  green: "bg-accent border-border-bright text-primary",
  bright: "bg-accent border-border-bright text-primary",
  dim: "bg-background border-border text-muted-foreground/60",
};

export function Chip({ children, variant = "default" }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-widest",
        chipVariants[variant]
      )}
    >
      {children}
    </span>
  );
}
