import { cn } from "@/lib/utils";

interface NCCardProps {
  children: React.ReactNode;
  glow?: boolean;
  className?: string;
}

export function NCCard({ children, glow, className }: NCCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-6 transition-all duration-200",
        glow ? "border-border-bright nc-glow" : "border-border nc-soft",
        className
      )}
    >
      {children}
    </div>
  );
}
