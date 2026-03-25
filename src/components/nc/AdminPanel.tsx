import { useEffect } from "react";
import { NCCard } from "./NCCard";
import { Chip } from "./Chip";
import { Btn } from "./Btn";
import { QUESTS, CREDENTIALS, shortAddr } from "@/lib/data";
import { type QuestStates, getQuestState } from "@/lib/questState";
import type { CredentialRecord } from "@/hooks/useWalletState";

interface AdminPanelProps {
  questStates: QuestStates;
  studentAddress: string | null;
  credentialRecords: Record<string, CredentialRecord>;
  onVerifyQuest: (questId: string, targetWallet?: string) => void;
  onRejectQuest: (questId: string, targetWallet?: string) => void;
  onApproveCredential: (credId: string) => void;
  allSubmissions: Array<{
    wallet_address: string;
    quest_id: string;
    status: string;
    submission_value: string | null;
  }>;
  onRefreshSubmissions: () => void;
}

export function AdminPanel({
  questStates,
  studentAddress,
  credentialRecords,
  onVerifyQuest,
  onRejectQuest,
  onApproveCredential,
  allSubmissions,
  onRefreshSubmissions,
}: AdminPanelProps) {
  useEffect(() => {
    onRefreshSubmissions();
  }, []);

  const verifiedQuests = QUESTS.filter((q) => getQuestState(questStates, q.id).status === "verified");
  const totalPts = verifiedQuests.reduce((s, q) => s + q.points, 0);

  const pendingCredentials = CREDENTIALS.filter(
    (c) => c.requiresAdminApproval && !credentialRecords[c.id]?.eligible
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
        <Btn onClick={onRefreshSubmissions} variant="ghost" className="px-4">
          ↻
        </Btn>
      </div>

      {/* Connected admin info */}
      <div className="mb-3.5 rounded-xl border border-border bg-background p-3.5">
        <div className="mb-2.5 text-[11px] text-muted-foreground">
          Admin — <span className="font-mono text-muted-foreground/50">
            {studentAddress ? shortAddr(studentAddress) : "No wallet connected"}
          </span>
        </div>

        {verifiedQuests.length > 0 && (
          <>
            <div className="mb-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/60">Your Verified</div>
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

      {/* All pending submissions from all wallets */}
      {allSubmissions.length > 0 && (
        <div className="mb-3.5">
          <div className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground/60">
            Pending Submissions ({allSubmissions.length})
          </div>
          {allSubmissions.map((sub) => {
            const quest = QUESTS.find((q) => q.id === sub.quest_id);
            return (
              <div key={`${sub.wallet_address}-${sub.quest_id}`} className="mb-2 rounded-xl border border-border bg-background p-3">
                <div className="mb-1 text-[13px] font-semibold text-foreground">
                  {quest?.title || sub.quest_id}
                </div>
                <div className="mb-1 text-[10px] font-mono text-muted-foreground/50">
                  {shortAddr(sub.wallet_address)}
                </div>
                {sub.submission_value && (
                  <div className="mb-2 break-all text-[11px] font-mono text-muted-foreground">
                    {sub.submission_value}
                  </div>
                )}
                <div className="flex gap-2">
                  <Btn
                    onClick={() => onVerifyQuest(sub.quest_id, sub.wallet_address)}
                    className="rounded-lg px-3 py-1 text-xs"
                  >
                    ✓ Verify
                  </Btn>
                  <Btn
                    onClick={() => onRejectQuest(sub.quest_id, sub.wallet_address)}
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
                ✓ Approve for Issuance
              </Btn>
            </div>
          ))}
        </div>
      )}

      {allSubmissions.length === 0 && pendingCredentials.length === 0 && (
        <div className="text-center text-[13px] text-muted-foreground/40 py-2">
          No pending items to review.
        </div>
      )}
    </NCCard>
  );
}
