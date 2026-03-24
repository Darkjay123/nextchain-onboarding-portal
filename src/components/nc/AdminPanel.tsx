import { NCCard } from "./NCCard";
import { Chip } from "./Chip";
import { Btn } from "./Btn";
import { QUESTS, CREDENTIALS, shortAddr } from "@/lib/data";
import { type QuestStates, getQuestState } from "@/lib/questState";

interface AdminPanelProps {
  questStates: QuestStates;
  studentAddress: string | null;
  credentialApprovals: Record<string, boolean>;
  onVerifyQuest: (questId: string) => void;
  onRejectQuest: (questId: string) => void;
  onApproveCredential: (credId: string) => void;
  onReset: () => void;
}

export function AdminPanel({
  questStates,
  studentAddress,
  credentialApprovals,
  onVerifyQuest,
  onRejectQuest,
  onApproveCredential,
  onReset,
}: AdminPanelProps) {
  const submittedQuests = QUESTS.filter((q) => {
    const s = getQuestState(questStates, q.id);
    return s.status === "submitted" || s.status === "under_review";
  });

  const verifiedQuests = QUESTS.filter((q) => getQuestState(questStates, q.id).status === "verified");
  const totalPts = verifiedQuests.reduce((s, q) => s + q.points, 0);

  // Credentials needing admin approval
  const pendingCredentials = CREDENTIALS.filter(
    (c) => c.requiresAdminApproval && !credentialApprovals[c.id]
  );

  return (
    <NCCard className="border-accent">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-extrabold text-foreground">Admin Panel</span>
            <Chip variant="dim">Internal</Chip>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Review submissions · verify quests · approve credentials
          </div>
        </div>
        <Btn onClick={onReset} variant="ghost" className="px-4">
          ↺
        </Btn>
      </div>

      {/* Student info */}
      <div className="mb-3.5 rounded-xl border border-border bg-background p-3.5">
        <div className="mb-2.5 text-[11px] text-muted-foreground">
          Student — <span className="font-mono text-muted-foreground/50">
            {studentAddress ? shortAddr(studentAddress) : "No wallet connected"}
          </span>
        </div>

        {/* Verified quests */}
        {verifiedQuests.length > 0 && (
          <>
            <div className="mb-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/60">Verified</div>
            {verifiedQuests.map((q) => (
              <div key={q.id} className="mb-1.5 flex justify-between">
                <span className="text-[13px] text-primary/70">✓ {q.title}</span>
                <span className="tabular text-[13px] text-muted-foreground">{q.points} pts</span>
              </div>
            ))}
            <div className="mt-2.5 flex justify-between border-t border-border pt-2.5">
              <span className="text-[13px] font-bold text-muted-foreground">Total</span>
              <span className="tabular text-[13px] font-extrabold text-primary">{totalPts} pts</span>
            </div>
          </>
        )}
      </div>

      {/* Pending submissions */}
      {submittedQuests.length > 0 && (
        <div className="mb-3.5">
          <div className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground/60">
            Pending Submissions ({submittedQuests.length})
          </div>
          {submittedQuests.map((q) => {
            const state = getQuestState(questStates, q.id);
            return (
              <div key={q.id} className="mb-2 rounded-xl border border-border bg-background p-3">
                <div className="mb-1 text-[13px] font-semibold text-foreground">{q.title}</div>
                {state.submittedData && (
                  <div className="mb-2 break-all text-[11px] font-mono text-muted-foreground">
                    {state.submittedData}
                  </div>
                )}
                <div className="flex gap-2">
                  <Btn
                    onClick={() => onVerifyQuest(q.id)}
                    className="rounded-lg px-3 py-1 text-xs"
                  >
                    ✓ Verify
                  </Btn>
                  <Btn
                    onClick={() => onRejectQuest(q.id)}
                    variant="danger"
                    className="rounded-lg px-3 py-1 text-xs"
                  >
                    ✕ Reject
                  </Btn>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Event attendance (admin-only quests) */}
      {QUESTS.filter((q) => q.verificationMethod === "admin_only").map((q) => {
        const state = getQuestState(questStates, q.id);
        if (state.status === "verified") return null;
        return (
          <div key={q.id} className="mb-2 rounded-xl border border-border bg-background p-3">
            <div className="mb-1 text-[13px] font-semibold text-foreground">{q.title}</div>
            <div className="mb-2 text-[11px] text-muted-foreground">{q.desc}</div>
            <Btn
              onClick={() => onVerifyQuest(q.id)}
              className="rounded-lg px-3 py-1 text-xs"
            >
              ✓ Mark as Attended
            </Btn>
          </div>
        );
      })}

      {/* Credential approvals */}
      {pendingCredentials.length > 0 && (
        <div className="mt-3.5">
          <div className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground/60">
            Credential Approvals
          </div>
          {pendingCredentials.map((cred) => (
            <div key={cred.id} className="mb-2 rounded-xl border border-border bg-background p-3">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-lg">{cred.emoji}</span>
                <span className="text-[13px] font-semibold text-foreground">{cred.title}</span>
              </div>
              <Btn
                onClick={() => onApproveCredential(cred.id)}
                className="rounded-lg px-3 py-1 text-xs"
              >
                ✓ Approve for Minting
              </Btn>
            </div>
          ))}
        </div>
      )}

      {submittedQuests.length === 0 && pendingCredentials.length === 0 && (
        <div className="text-center text-[13px] text-muted-foreground/40 py-2">
          No pending items to review.
        </div>
      )}
    </NCCard>
  );
}
