import { NCCard } from "./NCCard";
import { Chip } from "./Chip";
import { Btn } from "./Btn";
import { Bar } from "./Bar";
import { QUESTS, MAX_POINTS } from "@/lib/data";

interface QuestsSectionProps {
  completed: number[];
  onToggle: (id: number) => void;
  walletConnected: boolean;
}

const catChip: Record<string, "green" | "bright" | "dim"> = {
  Community: "green",
  Event: "bright",
  Learning: "green",
  Content: "dim",
  Onchain: "bright",
};

export function QuestsSection({ completed, onToggle, walletConnected }: QuestsSectionProps) {
  const pts = QUESTS.filter((q) => completed.includes(q.id)).reduce((s, q) => s + q.points, 0);

  return (
    <NCCard>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="text-lg font-extrabold text-foreground" style={{ letterSpacing: "-0.02em" }}>
            Onboarding Quests
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Offchain tracking — milestones unlock onchain credentials.
          </div>
        </div>
        <div className="text-right">
          <span className="tabular text-2xl font-black text-primary">{pts}</span>
          <span className="text-sm text-muted-foreground/50">/{MAX_POINTS}</span>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground/50">POINTS</div>
        </div>
      </div>
      <Bar pct={(pts / MAX_POINTS) * 100} />
      <div className="mt-4 flex flex-col gap-2.5">
        {QUESTS.map((q) => {
          const done = completed.includes(q.id);
          return (
            <div
              key={q.id}
              className="flex items-center gap-3.5 rounded-xl border p-3.5 transition-all duration-200"
              style={{
                background: done ? "hsl(150 30% 4%)" : "hsl(var(--secondary))",
                borderColor: done ? "hsl(150 30% 12%)" : "hsl(var(--border))",
                boxShadow: done ? "0 0 16px var(--green-glow)" : "none",
              }}
            >
              <div
                className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold transition-all duration-300"
                style={{
                  background: done ? "hsl(var(--primary))" : "hsl(var(--muted))",
                  border: `1.5px solid ${done ? "hsl(var(--primary))" : "hsl(var(--border))"}`,
                  color: "hsl(var(--primary-foreground))",
                  boxShadow: done ? "0 0 10px var(--green-glow)" : "none",
                }}
              >
                {done ? "✓" : ""}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{q.title}</span>
                  <Chip variant={catChip[q.cat] || "dim"}>{q.cat}</Chip>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{q.desc}</div>
              </div>
              <div className="flex-shrink-0 text-right" style={{ minWidth: 40 }}>
                <div className="tabular text-[15px] font-extrabold" style={{ color: done ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.4)" }}>
                  +{q.points}
                </div>
                <div className="text-[10px] text-muted-foreground/40">pts</div>
              </div>
              <Btn
                onClick={() => walletConnected && onToggle(q.id)}
                disabled={!walletConnected}
                variant={done ? "success" : "outline"}
                className="flex-shrink-0 rounded-lg px-3.5 py-1.5 text-xs"
              >
                {done ? "Done ✓" : "Mark Done"}
              </Btn>
            </div>
          );
        })}
        {!walletConnected && (
          <div className="py-2 text-center text-[13px] text-muted-foreground">
            Connect a wallet to begin completing quests.
          </div>
        )}
      </div>
    </NCCard>
  );
}
