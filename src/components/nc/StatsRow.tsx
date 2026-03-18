import { NCCard } from "./NCCard";
import { QUESTS, CREDENTIALS, MAX_POINTS } from "@/lib/data";

interface StatsRowProps {
  pts: number;
  done: number;
  minted: Record<string, boolean>;
}

export function StatsRow({ pts, done, minted }: StatsRowProps) {
  const mintCount = Object.values(minted).filter(Boolean).length;
  const items = [
    { icon: "⚡", val: String(pts), sub: `of ${MAX_POINTS} pts`, label: "Points Earned" },
    { icon: "📋", val: `${done}/${QUESTS.length}`, sub: "quests done", label: "Quests" },
    { icon: "🏅", val: `${mintCount}/${CREDENTIALS.length}`, sub: "credentials", label: "Credentials" },
    { icon: "🌍", val: "Base", sub: "Chain 8453", label: "Network" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((item) => (
        <NCCard key={item.label} className="p-4 text-center">
          <div className="mb-2 text-xl">{item.icon}</div>
          <div className="tabular text-[22px] font-black text-primary" style={{ letterSpacing: "-0.03em" }}>
            {item.val}
          </div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">{item.sub}</div>
        </NCCard>
      ))}
    </div>
  );
}
