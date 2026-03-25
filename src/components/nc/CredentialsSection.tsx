import { useState } from "react";
import { NCCard } from "./NCCard";
import { Chip } from "./Chip";
import { Btn } from "./Btn";
import { Bar } from "./Bar";
import { CREDENTIALS, QUESTS, CONTRACT_ADDRESS, shortAddr, type Credential } from "@/lib/data";
import { type QuestStates, getQuestState } from "@/lib/questState";
import { mintCredential } from "@/lib/mintCredential";
import type { CredentialRecord } from "@/hooks/useWalletState";

interface CredentialsSectionProps {
  questStates: QuestStates;
  totalPts: number;
  walletConnected: boolean;
  walletAddress: string | null;
  credentialRecords: Record<string, CredentialRecord>;
  isAdmin: boolean;
  onUpdateCredential: (credId: string, update: Partial<CredentialRecord>, targetWallet?: string) => void;
}

function getCredentialProgress(
  cred: Credential,
  questStates: QuestStates
) {
  const questDetails = cred.requiredQuests.map((qId) => {
    const quest = QUESTS.find((q) => q.id === qId);
    const state = getQuestState(questStates, qId);
    return { id: qId, title: quest?.title || qId, done: state.status === "verified" };
  });
  const completed = questDetails.filter((q) => q.done).length;
  return {
    completed,
    total: questDetails.length,
    allMet: completed === questDetails.length,
    questDetails,
  };
}

export function CredentialsSection({
  questStates,
  totalPts,
  walletConnected,
  walletAddress,
  credentialRecords,
  isAdmin,
  onUpdateCredential,
}: CredentialsSectionProps) {
  const [mintingId, setMintingId] = useState<string | null>(null);
  const [mintResults, setMintResults] = useState<Record<string, { txHash?: string; error?: string }>>({});

  const handleAdminMint = async (credId: string) => {
    if (!walletAddress) return;
    setMintingId(credId);
    setMintResults((prev) => ({ ...prev, [credId]: {} }));

    const result = await mintCredential(walletAddress);

    if (result.success && result.txHash) {
      setMintResults((prev) => ({ ...prev, [credId]: { txHash: result.txHash } }));
      onUpdateCredential(credId, {
        issued: true,
        tx_hash: result.txHash,
        issued_at: new Date().toISOString(),
      });
    } else {
      setMintResults((prev) => ({ ...prev, [credId]: { error: result.error } }));
    }
    setMintingId(null);
  };

  return (
    <NCCard>
      <div className="mb-5">
        <div className="text-lg font-extrabold text-foreground" style={{ letterSpacing: "-0.02em" }}>
          Onchain Credentials
        </div>
        <div className="mt-1 text-[13px] text-muted-foreground">
          ERC-721 soulbound-style badges on Base — non-transferable, portable proof of participation.
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
        {CREDENTIALS.map((cred) => {
          const progress = getCredentialProgress(cred, questStates);
          const meetsPoints = cred.minPoints ? totalPts >= cred.minPoints : true;
          const credRecord = credentialRecords[cred.id];
          const meetsAdmin = cred.requiresAdminApproval ? credRecord?.eligible : true;
          const unlocked = progress.allMet && meetsPoints && meetsAdmin;
          const issued = credRecord?.issued || false;
          const isMinting = mintingId === cred.id;
          const result = mintResults[cred.id];

          return (
            <div
              key={cred.id}
              className="flex flex-col gap-3 rounded-2xl border p-5 transition-all duration-300"
              style={{
                background: unlocked
                  ? "linear-gradient(145deg, hsl(150 20% 6%), hsl(var(--background)))"
                  : "hsl(var(--background))",
                borderColor: issued
                  ? "hsl(var(--primary))"
                  : unlocked
                    ? "hsl(var(--border-bright))"
                    : "hsl(var(--border))",
                boxShadow: issued
                  ? "0 0 24px var(--green-glow)"
                  : unlocked
                    ? "0 0 16px var(--green-glow)"
                    : "none",
              }}
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl border text-[22px]"
                  style={{
                    background: unlocked ? "hsl(150 25% 8%)" : "hsl(var(--secondary))",
                    borderColor: unlocked ? "hsl(var(--border-bright))" : "hsl(var(--border))",
                    boxShadow: unlocked ? "0 0 16px var(--green-glow)" : "none",
                  }}
                >
                  {cred.emoji}
                </div>
                {issued ? (
                  <Chip variant="green">Issued ✓</Chip>
                ) : unlocked ? (
                  <Chip variant="bright">Eligible</Chip>
                ) : (
                  <Chip variant="dim">Locked</Chip>
                )}
              </div>
              <div>
                <div
                  className="mb-1.5 text-sm font-bold leading-snug"
                  style={{ color: unlocked ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground) / 0.4)" }}
                >
                  {cred.title}
                </div>
                <div className="text-[11.5px] leading-relaxed text-muted-foreground">{cred.desc}</div>
              </div>

              {/* Requirements list */}
              <div className="flex flex-col gap-1.5">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground/60">Requirements</div>
                {progress.questDetails.map((qd) => (
                  <div key={qd.id} className="flex items-center gap-2 text-[11.5px]">
                    <span style={{ color: qd.done ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.4)" }}>
                      {qd.done ? "✓" : "○"}
                    </span>
                    <span style={{ color: qd.done ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground) / 0.5)" }}>
                      {qd.title}
                    </span>
                  </div>
                ))}
                {cred.minPoints && (
                  <div className="flex items-center gap-2 text-[11.5px]">
                    <span style={{ color: meetsPoints ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.4)" }}>
                      {meetsPoints ? "✓" : "○"}
                    </span>
                    <span style={{ color: meetsPoints ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground) / 0.5)" }}>
                      Earn {cred.minPoints}+ points
                    </span>
                  </div>
                )}
                {cred.requiresAdminApproval && (
                  <div className="flex items-center gap-2 text-[11.5px]">
                    <span style={{ color: meetsAdmin ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.4)" }}>
                      {meetsAdmin ? "✓" : "○"}
                    </span>
                    <span style={{ color: meetsAdmin ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground) / 0.5)" }}>
                      Admin approval
                    </span>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div>
                <div className="mb-1.5 flex justify-between">
                  <span className="text-[11px] text-muted-foreground">Progress</span>
                  <span
                    className="tabular text-[11px] font-bold"
                    style={{ color: unlocked ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.4)" }}
                  >
                    {progress.completed}/{progress.total} tasks
                  </span>
                </div>
                <Bar pct={(progress.completed / progress.total) * 100} />
              </div>

              {/* Status / Mint area */}
              {issued ? (
                <div className="flex flex-col gap-2">
                  <Btn disabled variant="success" className="w-full justify-center text-xs">
                    Credential Issued ✓
                  </Btn>
                  {credRecord?.tx_hash && (
                    <div className="text-center text-[10.5px] text-primary break-all">
                      <a
                        href={`https://basescan.org/tx/${credRecord.tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        View on BaseScan ↗
                      </a>
                    </div>
                  )}
                  {credRecord?.token_id && (
                    <div className="text-center text-[10px] text-muted-foreground">
                      Token #{credRecord.token_id} · {shortAddr(CONTRACT_ADDRESS)}
                    </div>
                  )}
                </div>
              ) : isMinting ? (
                <Btn disabled variant="outline" className="w-full justify-center text-xs">
                  <span className="animate-pulse">Minting…</span>
                </Btn>
              ) : isAdmin && unlocked ? (
                <Btn
                  onClick={() => handleAdminMint(cred.id)}
                  variant="primary"
                  className="w-full justify-center text-xs"
                >
                  ⬡ Mint Credential
                </Btn>
              ) : unlocked && walletConnected ? (
                <div className="rounded-lg border border-border bg-secondary p-3 text-center">
                  <div className="text-[12px] font-semibold text-primary">Eligible for Credential</div>
                  <div className="mt-1 text-[11px] text-muted-foreground">Awaiting admin issuance</div>
                </div>
              ) : !walletConnected ? (
                <div className="text-center text-[11px] text-muted-foreground/40">Connect wallet to view</div>
              ) : (
                <div className="text-center text-[11px] text-muted-foreground">
                  Complete all requirements to unlock
                </div>
              )}

              {/* Result feedback */}
              {result?.txHash && !issued && (
                <div className="text-center text-[10.5px] text-primary break-all">
                  ✓ TX:{" "}
                  <a
                    href={`https://basescan.org/tx/${result.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {result.txHash.slice(0, 10)}…{result.txHash.slice(-6)}
                  </a>
                </div>
              )}
              {result?.error && (
                <div className="text-center text-[10.5px] text-destructive">{result.error}</div>
              )}
            </div>
          );
        })}
      </div>
    </NCCard>
  );
}
