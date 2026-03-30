import { useEffect, useState } from "react";
import { NCCard } from "./NCCard";
import { Chip } from "./Chip";
import { Btn } from "./Btn";
import { QUESTS, CREDENTIALS, shortAddr } from "@/lib/data";
import { type QuestStates, getQuestState } from "@/lib/questState";
import { mintCredential } from "@/lib/mintCredential";
import type { CredentialRecord } from "@/hooks/useWalletState";
import { supabase } from "@/integrations/supabase/client";

interface AdminPanelProps {
  questStates: QuestStates;
  studentAddress: string | null;
  credentialRecords: Record<string, CredentialRecord>;
  onVerifyQuest: (questId: string, targetWallet?: string) => void;
  onRejectQuest: (questId: string, targetWallet?: string) => void;
  onApproveCredential: (credId: string) => void;
  onUpdateCredential: (credId: string, update: Partial<CredentialRecord>, targetWallet?: string) => void;
  allSubmissions: Array<{
    wallet_address: string;
    quest_id: string;
    status: string;
    submission_value: string | null;
  }>;
  onRefreshSubmissions: () => void;
}

interface PendingIssuance {
  wallet_address: string;
  credential_id: string;
  eligible: boolean;
  issued: boolean;
}

export function AdminPanel({
  questStates,
  studentAddress,
  credentialRecords,
  onVerifyQuest,
  onRejectQuest,
  onApproveCredential,
  onUpdateCredential,
  allSubmissions,
  onRefreshSubmissions,
}: AdminPanelProps) {
  const [pendingIssuances, setPendingIssuances] = useState<PendingIssuance[]>([]);
  const [mintingKey, setMintingKey] = useState<string | null>(null);
  const [mintResults, setMintResults] = useState<Record<string, { txHash?: string; error?: string }>>({});

  const loadPendingIssuances = async () => {
    const { data } = await supabase
      .from("credential_status")
      .select("wallet_address, credential_id, eligible, issued")
      .eq("eligible", true)
      .eq("issued", false);
    if (data) setPendingIssuances(data);
  };

  useEffect(() => {
    onRefreshSubmissions();
    loadPendingIssuances();
  }, []);

  const handleMintToUser = async (recipientWallet: string, credId: string) => {
    const key = `${recipientWallet}-${credId}`;
    setMintingKey(key);
    setMintResults((prev) => ({ ...prev, [key]: {} }));

    // Pre-check: already issued?
    try {
      const { data: existing, error: checkError } = await supabase
        .from("credential_status")
        .select("issued")
        .eq("wallet_address", recipientWallet.toLowerCase())
        .eq("credential_id", credId)
        .maybeSingle();

      if (checkError) {
        console.warn("credential_status pre-check warning:", checkError);
        // Don't block mint — proceed anyway
      }

      if (existing?.issued) {
        setMintResults((prev) => ({
          ...prev,
          [key]: { error: "This wallet has already received a credential with the current contract." },
        }));
        setMintingKey(null);
        return;
      }
    } catch (err) {
      console.warn("credential_status pre-check exception:", err);
      // Don't block mint — proceed anyway
    }

    // Mint TO the recipient wallet, not admin
    const result = await mintCredential(recipientWallet);

    if (result.success && result.txHash) {
      setMintResults((prev) => ({ ...prev, [key]: { txHash: result.txHash } }));
      onUpdateCredential(credId, {
        issued: true,
        tx_hash: result.txHash,
        issued_at: new Date().toISOString(),
      }, recipientWallet);
      // Refresh list
      loadPendingIssuances();
    } else {
      setMintResults((prev) => ({ ...prev, [key]: { error: result.error } }));
    }
    setMintingKey(null);
  };

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
            Review submissions · verify quests · approve credentials · mint to users
          </div>
        </div>
        <Btn onClick={() => { onRefreshSubmissions(); loadPendingIssuances(); }} variant="ghost" className="px-4">
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

      {/* ═══ PENDING CREDENTIAL ISSUANCE ═══ */}
      {pendingIssuances.length > 0 && (
        <div className="mb-3.5">
          <div className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground/60">
            Pending Credential Issuance ({pendingIssuances.length})
          </div>
          {pendingIssuances.map((item) => {
            const cred = CREDENTIALS.find((c) => c.id === item.credential_id);
            const key = `${item.wallet_address}-${item.credential_id}`;
            const isMinting = mintingKey === key;
            const result = mintResults[key];

            return (
              <div key={key} className="mb-2 rounded-xl border border-border bg-background p-3">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-lg">{cred?.emoji || "🏅"}</span>
                  <span className="text-[13px] font-semibold text-foreground">
                    {cred?.title || item.credential_id}
                  </span>
                </div>
                <div className="mb-1 text-[10px] font-mono text-muted-foreground/50">
                  Recipient: {shortAddr(item.wallet_address)}
                </div>
                <div className="mb-1 text-[10px] text-primary/60">
                  Eligible ✓ · Not yet issued
                </div>

                {isMinting ? (
                  <Btn disabled variant="outline" className="rounded-lg px-3 py-1 text-xs">
                    <span className="animate-pulse">Minting…</span>
                  </Btn>
                ) : result?.txHash ? (
                  <div className="text-[10.5px] text-primary break-all">
                    ✓ Minted —{" "}
                    <a
                      href={`https://basescan.org/tx/${result.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      View TX ↗
                    </a>
                  </div>
                ) : (
                  <Btn
                    onClick={() => handleMintToUser(item.wallet_address, item.credential_id)}
                    className="rounded-lg px-3 py-1 text-xs"
                  >
                    ⬡ Mint to {shortAddr(item.wallet_address)}
                  </Btn>
                )}

                {result?.error && (
                  <div className="mt-1 text-[10.5px] text-destructive">{result.error}</div>
                )}
              </div>
            );
          })}
        </div>
      )}

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

      {allSubmissions.length === 0 && pendingIssuances.length === 0 && pendingCredentials.length === 0 && (
        <div className="text-center text-[13px] text-muted-foreground/40 py-2">
          No pending items to review.
        </div>
      )}
    </NCCard>
  );
}
