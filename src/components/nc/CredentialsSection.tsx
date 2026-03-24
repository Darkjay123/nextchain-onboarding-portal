import { useState } from "react";
import { NCCard } from "./NCCard";
import { Chip } from "./Chip";
import { Btn } from "./Btn";
import { Bar } from "./Bar";
import { CREDENTIALS } from "@/lib/data";
import { mintCredential } from "@/lib/mintCredential";

interface CredentialsSectionProps {
  pts: number;
  walletConnected: boolean;
  walletAddress: string | null;
  adminVerified: boolean;
  minted: Record<string, boolean>;
  onMint: (id: string) => void;
}

export function CredentialsSection({ pts, walletConnected, walletAddress, adminVerified, minted, onMint }: CredentialsSectionProps) {
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
          const unlocked = pts >= cred.req;
          const canClaim = unlocked && walletConnected && adminVerified && !minted[cred.id];
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
              <div>
                <div className="mb-1.5 flex justify-between">
                  <span className="text-[11px] text-muted-foreground">Progress</span>
                  <span
                    className="tabular text-[11px] font-bold"
                    style={{ color: unlocked ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.4)" }}
                  >
                    {Math.min(pts, cred.req)}/{cred.req} pts
                  </span>
                </div>
                <Bar pct={(pts / cred.req) * 100} />
              </div>

              {/* Mint button / status */}
              {isMinting ? (
                <Btn disabled variant="outline" className="w-full justify-center text-xs">
                  Minting…
                </Btn>
              ) : canClaim || claimed ? (
                <Btn
                  onClick={() => canClaim && handleMint(cred.id)}
                  disabled={claimed}
                  variant={claimed ? "success" : "primary"}
                  className="w-full justify-center text-xs"
                >
                  {claimed ? "Claimed on Base ✓" : "⬡ Claim on Base"}
                </Btn>
              ) : unlocked && walletConnected && !adminVerified ? (
                <div className="text-center text-[11px] text-muted-foreground">⏳ Awaiting admin verification</div>
              ) : !walletConnected ? (
                <div className="text-center text-[11px] text-muted-foreground/40">Connect wallet to claim</div>
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
