import { NCCard } from "./NCCard";
import { Chip } from "./Chip";
import { Btn } from "./Btn";
import { QUESTS, DEMO_ADDR, shortAddr } from "@/lib/data";

interface AdminPanelProps {
  completed: number[];
  adminVerified: boolean;
  onVerify: () => void;
  onReset: () => void;
}

export function AdminPanel({ completed, adminVerified, onVerify, onReset }: AdminPanelProps) {
  const doneQuests = QUESTS.filter((q) => completed.includes(q.id));
  const total = doneQuests.reduce((s, q) => s + q.points, 0);

  return (
    <NCCard className="border-accent">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-extrabold text-foreground">Admin Panel</span>
            <Chip variant="dim">Internal</Chip>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Verify completion · unlock credential minting
          </div>
        </div>
        <div
          className="h-2.5 w-2.5 rounded-full"
          style={{
            background: adminVerified ? "hsl(var(--primary))" : "#ca8a04",
            boxShadow: `0 0 8px ${adminVerified ? "hsl(var(--primary))" : "#ca8a04"}`,
          }}
        />
      </div>
      <div className="mb-3.5 rounded-xl border border-border bg-background p-3.5">
        <div className="mb-2.5 text-[11px] text-muted-foreground">
          Student — <span className="font-mono text-muted-foreground/50">{shortAddr(DEMO_ADDR)}</span>
        </div>
        {doneQuests.length === 0 ? (
          <div className="text-[13px] text-muted-foreground/40">No quests submitted yet.</div>
        ) : (
          doneQuests.map((q) => (
            <div key={q.id} className="mb-1.5 flex justify-between">
              <span className="text-[13px] text-primary/70">✓ {q.title}</span>
              <span className="tabular text-[13px] text-muted-foreground">{q.points} pts</span>
            </div>
          ))
        )}
        {doneQuests.length > 0 && (
          <div className="mt-2.5 flex justify-between border-t border-border pt-2.5">
            <span className="text-[13px] font-bold text-muted-foreground">Total</span>
            <span className="tabular text-[13px] font-extrabold text-primary">{total} pts</span>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Btn
          onClick={onVerify}
          disabled={adminVerified || completed.length === 0}
          variant={adminVerified ? "success" : "primary"}
          className="flex-1 justify-center"
        >
          {adminVerified ? "✓ Verified" : "Approve & Verify"}
        </Btn>
        <Btn onClick={onReset} variant="ghost" className="px-4">
          ↺
        </Btn>
      </div>
      {adminVerified && (
        <div className="mt-3 text-center text-xs text-primary">
          Student unlocked — credential minting available on Base.
        </div>
      )}
    </NCCard>
  );
}
