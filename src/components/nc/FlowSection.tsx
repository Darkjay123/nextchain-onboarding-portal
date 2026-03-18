import { NCCard } from "./NCCard";
import { STEPS } from "@/lib/data";

interface FlowSectionProps {
  step: number;
}

export function FlowSection({ step }: FlowSectionProps) {
  return (
    <NCCard>
      <div className="mb-4">
        <div className="text-[15px] font-bold text-foreground">Onboarding Journey</div>
        <div className="mt-1 text-xs text-muted-foreground">
          Step {step} of {STEPS.length} — new student → onchain identity
        </div>
      </div>
      <div className="flex items-center overflow-x-auto pb-1">
        {STEPS.map((s, i) => (
          <div key={s.n} className="flex items-center">
            <div className="flex min-w-[84px] flex-col items-center gap-2">
              <div
                className="flex h-[34px] w-[34px] items-center justify-center rounded-full text-xs font-extrabold transition-all duration-300"
                style={{
                  background: s.n < step ? "hsl(var(--primary))" : "transparent",
                  color:
                    s.n < step
                      ? "hsl(var(--primary-foreground))"
                      : s.n === step
                        ? "hsl(var(--primary))"
                        : "hsl(var(--muted-foreground) / 0.5)",
                  border:
                    s.n === step
                      ? "2px solid hsl(var(--primary))"
                      : s.n < step
                        ? "2px solid hsl(var(--primary))"
                        : "2px solid hsl(var(--border))",
                  boxShadow: s.n === step ? "0 0 14px var(--green-glow-strong)" : "none",
                }}
              >
                {s.n < step ? "✓" : s.n}
              </div>
              <div
                className="text-center text-[10px] leading-tight"
                style={{
                  color: s.n <= step ? "hsl(var(--muted-foreground))" : "hsl(var(--muted-foreground) / 0.4)",
                }}
              >
                {s.label}
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="mx-0.5 -mt-5 h-[1.5px] w-7 flex-shrink-0 transition-all duration-300"
                style={{
                  background: s.n < step ? "hsl(var(--primary))" : "hsl(var(--border))",
                  boxShadow: s.n < step ? "0 0 6px hsl(var(--primary))" : "none",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </NCCard>
  );
}
