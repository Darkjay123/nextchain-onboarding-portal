import { Wallet, Check } from "lucide-react";
import { Chip } from "./Chip";
import { Btn } from "./Btn";
import { LogoMark } from "./Logo";
import { DEMO_ADDR, shortAddr } from "@/lib/data";

interface HeroSectionProps {
  walletConnected: boolean;
  onConnect: () => void;
  onCreate: () => void;
}

export function HeroSection({ walletConnected, onConnect, onCreate }: HeroSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-3.5 md:grid-cols-[1fr_200px]">
      {/* Main hero */}
      <div
        className="relative overflow-hidden rounded-2xl border border-border-bright p-8 md:p-10"
        style={{ background: "radial-gradient(ellipse at 0% 0%, hsl(150 25% 8%), hsl(var(--card)))" }}
      >
        {/* Glow orb */}
        <div
          className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full"
          style={{ background: "var(--green-glow)", filter: "blur(60px)" }}
        />
        <div className="relative">
          <div className="mb-5 flex flex-wrap gap-2">
            <Chip variant="green">Base MVP</Chip>
            <Chip variant="dim">DELSU Pilot</Chip>
            <Chip variant="dim">Nigeria → Africa</Chip>
          </div>
          <h1 className="mb-2 text-[clamp(24px,3.6vw,40px)] font-extrabold leading-[1.12] text-foreground">
            Campus onboarding,
            <br />
            <span className="text-primary">now onchain.</span>
          </h1>
          <p className="mb-7 max-w-md text-sm leading-7 text-muted-foreground">
            Building the next generation of Web3 leaders — wallet setup, quest tracking,
            and non-transferable participation credentials on Base.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {!walletConnected ? (
              <>
                <Btn onClick={onConnect}>
                  <Wallet size={14} strokeWidth={2.5} /> Connect Wallet
                </Btn>
                <Btn variant="outline" onClick={onCreate}>
                  ✦ Create New Wallet
                </Btn>
              </>
            ) : (
              <Btn variant="success" className="cursor-default">
                <Check size={13} strokeWidth={3} /> {shortAddr(DEMO_ADDR)} · Connected
              </Btn>
            )}
          </div>
        </div>
      </div>

      {/* Network badge */}
      <div
        className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border-bright p-6 nc-glow"
        style={{ background: "radial-gradient(ellipse at 50% 30%, hsl(150 25% 8%), hsl(var(--card)))" }}
      >
        <div
          className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-border-bright"
          style={{
            background: "linear-gradient(135deg, hsl(150 30% 10%), hsl(150 40% 16%))",
            boxShadow: "0 0 30px var(--green-glow-strong)",
          }}
        >
          <LogoMark size={42} />
        </div>
        <div className="text-center">
          <div className="text-base font-extrabold text-foreground" style={{ letterSpacing: "-0.02em" }}>
            Base Network
          </div>
          <div className="mt-1 text-xs text-muted-foreground">EVM L2 · Chain 8453</div>
        </div>
        <Chip variant="green">ERC-721 Soulbound</Chip>
      </div>
    </div>
  );
}
