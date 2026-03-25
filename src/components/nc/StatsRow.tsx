import { NCCard } from "./NCCard";
import { QUESTS, CREDENTIALS, MAX_POINTS } from "@/lib/data";
import { type QuestStates, getQuestState } from "@/lib/questState";
import type { CredentialRecord } from "@/hooks/useWalletState";

interface StatsRowProps {
  questStates: QuestStates;
  credentialRecords: Record<string, CredentialRecord>;
}

export function StatsRow({ questStates, credentialRecords }: StatsRowProps) {
  const pts = QUESTS.filter((q) => getQuestState(questStates, q.id).status === "verified")
    .reduce((s, q) => s + q.points, 0);
  const done = QUESTS.filter((q) => getQuestState(questStates, q.id).status === "verified").length;
  const issuedCount = Object.values(credentialRecords).filter((c) => c.issued).length;

  const items = [
    { icon: "⚡", val: String(pts), sub: `of ${MAX_POINTS} pts`, label: "Points Earned" },
    { icon: "📋", val: `${done}/${QUESTS.length}`, sub: "quests done", label: "Quests" },
    { icon: "🏅", val: `${issuedCount}/${CREDENTIALS.length}`, sub: "credentials", label: "Credentials" },
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
