import { motion } from "framer-motion";

interface JourneyTrackProps {
  step: number;
}

const JOURNEY_STEPS = [
  { id: 1, label: "Join", icon: "⬡" },
  { id: 2, label: "Learn", icon: "📚" },
  { id: 3, label: "Act", icon: "⚡" },
  { id: 4, label: "Contribute", icon: "🔨" },
  { id: 5, label: "Identity", icon: "🏅" },
];

export function JourneyTrack({ step }: JourneyTrackProps) {
  return (
    <div className="flex items-center justify-between gap-1">
      {JOURNEY_STEPS.map((s, i) => {
        const active = step >= s.id;
        const current = step === s.id;
        return (
          <div key={s.id} className="flex flex-1 items-center">
            <motion.div
              className="flex flex-col items-center gap-1.5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <motion.div
                className="flex h-10 w-10 items-center justify-center rounded-xl border text-base"
                style={{
                  background: active
                    ? "linear-gradient(135deg, hsl(150 30% 10%), hsl(150 40% 16%))"
                    : "hsl(var(--secondary))",
                  borderColor: current
                    ? "hsl(var(--primary))"
                    : active
                      ? "hsl(var(--border-bright))"
                      : "hsl(var(--border))",
                  boxShadow: current ? "0 0 16px var(--green-glow-strong)" : "none",
                }}
                animate={current ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {s.icon}
              </motion.div>
              <span
                className="text-[10px] font-bold"
                style={{
                  color: active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.4)",
                }}
              >
                {s.label}
              </span>
            </motion.div>
            {i < JOURNEY_STEPS.length - 1 && (
              <div className="mx-1 h-[2px] flex-1">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: step > s.id ? "hsl(var(--primary))" : "hsl(var(--border))",
                    boxShadow: step > s.id ? "0 0 6px hsl(var(--primary))" : "none",
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: i * 0.15 + 0.2, duration: 0.5 }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
