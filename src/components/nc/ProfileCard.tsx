import { useAccount } from "wagmi";
import { NCCard } from "./NCCard";
import { Bar } from "./Bar";
import { shortAddr, MAX_POINTS } from "@/lib/data";

interface ProfileCardProps {
  walletConnected: boolean;
  pts: number;
}

export function ProfileCard({ walletConnected, pts }: ProfileCardProps) {
  const { address } = useAccount();
  const fields = [
    { label: "Wallet", val: walletConnected && address ? shortAddr(address) : "Not connected", mono: true, green: walletConnected },
    { label: "Network", val: "Base — Chain 8453", mono: false, green: false },
    { label: "Status", val: walletConnected ? "Active" : "Pending", mono: false, green: false },
  ];

  return (
    <NCCard>
      <div className="mb-1 text-base font-extrabold text-foreground">Student Profile</div>
      <div className="mb-5 text-xs text-muted-foreground">Demo wallet · onboarding state</div>
      {fields.map(({ label, val, mono, green }) => (
        <div key={label} className="mb-2 rounded-xl border border-border bg-background px-3.5 py-3">
          <div className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
          <div
            className="text-[13px] font-semibold"
            style={{
              color: green ? "hsl(var(--primary))" : "hsl(var(--foreground))",
              fontFamily: mono ? "monospace" : "inherit",
            }}
          >
            {val}
          </div>
        </div>
      ))}
      <div className="rounded-xl border border-border bg-background p-3.5">
        <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">Quest Progress</div>
        <Bar pct={(pts / MAX_POINTS) * 100} />
        <div className="mt-2 flex justify-between">
          <span className="tabular text-xs font-bold text-primary">{pts} pts</span>
          <span className="text-xs text-muted-foreground/50">max {MAX_POINTS}</span>
        </div>
      </div>
    </NCCard>
  );
}
