import { useState } from "react";
import { NCCard } from "./NCCard";
import { Chip } from "./Chip";
import { Btn } from "./Btn";
import { Bar } from "./Bar";
import { CREDENTIALS, QUESTS, type Credential } from "@/lib/data";
import { type QuestStates, getQuestState } from "@/lib/questState";
import { mintCredential } from "@/lib/mintCredential";

interface CredentialsSectionProps {
  questStates: QuestStates;
  totalPts: number;
  walletConnected: boolean;
  walletAddress: string | null;
  adminVerified: Record<string, boolean>;
  minted: Record<string, boolean>;
  onMint: (id: string) => void;
}

function getCredentialProgress(
  cred: Credential,
  questStates: QuestStates
): { completed: number; total: number; allMet: boolean; questDetails: { id: string; title: string; done: boolean }[] } {
  const questDetails = cred.requiredQuests.map((qId) => {
    const quest = QUESTS.find((q) => q.id === qId);
    const state = getQuestState(questStates, qId);
    return {
      id: qId,
      title: quest?.title || qId,
      done: state.status === "verified",
    };
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
  adminVerified,
  minted,
  onMint,
}: CredentialsSectionProps) {
  const [mintingId, setMintingId] = useState<string | null>(null);
  const [mintResults, setMintResults] = useState<Record<string, { txHash?: string; error?: string }>>({});

  const handleMint = async (credId: string) => {
    if (!walletAddress) return;
    setMintingId(credId);
    setMintResults((prev) => ({ ...prev, [credId]: {} }));

    const result = await mintCredential(walletAddress);

    if (result.success) {
      setMintResults((prev) => ({ ...prev, [credId]: { txHash: result.txHash } }));
      onMint(credId);
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
          const meetsAdmin = cred.requiresAdminApproval ? adminVerified[cred.id] : true;
          const unlocked = progress.allMet && meetsPoints && meetsAdmin;
          const canClaim = unlocked && walletConnected && !minted[cred.id];
          const claimed = minted[cred.id];
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
                borderColor: claimed
                  ? "hsl(var(--primary))"
                  : unlocked
                    ? "hsl(var(--border-bright))"
                    : "hsl(var(--border))",
                boxShadow: claimed
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
                {claimed ? (
                  <Chip variant="green">Minted ✓</Chip>
                ) : unlocked ? (
                  <Chip variant="bright">Unlocked</Chip>
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
                    <span
                      style={{ color: qd.done ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground) / 0.5)" }}
                    >
                      {qd.title}
                    </span>
                  </div>
                ))}
                {cred.minPoints && (
                  <div className="flex items-center gap-2 text-[11.5px]">
                    <span style={{ color: meetsPoints ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.4)" }}>
                      {meetsPoints ? "✓" : "○"}
                    </span>
                    <span
                      style={{ color: meetsPoints ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground) / 0.5)" }}
                    >
                      Earn {cred.minPoints}+ points
                    </span>
                  </div>
                )}
                {cred.requiresAdminApproval && (
                  <div className="flex items-center gap-2 text-[11.5px]">
                    <span style={{ color: meetsAdmin ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.4)" }}>
                      {meetsAdmin ? "✓" : "○"}
                    </span>
                    <span
                      style={{ color: meetsAdmin ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground) / 0.5)" }}
                    >
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

              {/* Mint button / status */}
              {isMinting ? (
                <Btn disabled variant="outline" className="w-full justify-center text-xs">
                  Minting…
                </Btn>
              ) : canClaim ? (
                <Btn
                  onClick={() => handleMint(cred.id)}
                  variant="primary"
                  className="w-full justify-center text-xs"
                >
                  ⬡ Claim on Base
                </Btn>
              ) : claimed ? (
                <Btn disabled variant="success" className="w-full justify-center text-xs">
                  Claimed on Base ✓
                </Btn>
              ) : !walletConnected ? (
                <div className="text-center text-[11px] text-muted-foreground/40">Connect wallet to claim</div>
              ) : !unlocked ? (
                <div className="text-center text-[11px] text-muted-foreground">
                  Complete all requirements to unlock
                </div>
              ) : null}

              {/* Result feedback */}
              {result?.txHash && (
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
