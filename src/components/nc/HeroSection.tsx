import { Check } from "lucide-react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Chip } from "./Chip";
import { Btn } from "./Btn";
import { LogoMark } from "./Logo";
import { shortAddr } from "@/lib/data";

const WALLET_LINKS = [
  { name: "MetaMask", url: "https://metamask.io/download/" },
  { name: "Zerion", url: "https://zerion.io/download" },
  { name: "Coinbase Wallet", url: "https://www.coinbase.com/wallet/downloads" },
  { name: "Trust Wallet", url: "https://trustwallet.com/download" },
];

export function HeroSection() {
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();
  const [showWalletHelp, setShowWalletHelp] = React.useState(false);

  return (
    <div className="grid grid-cols-1 gap-3.5 md:grid-cols-[1fr_200px]">
      {/* Main hero */}
      <div
        className="relative overflow-hidden rounded-2xl border border-border-bright p-8 md:p-10"
        style={{ background: "radial-gradient(ellipse at 0% 0%, hsl(150 25% 8%), hsl(var(--card)))" }}
      >
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
            {!isConnected ? (
              <>
                <Btn onClick={() => openConnectModal?.()}>
                  ⬡ Connect Wallet
                </Btn>
                <Btn variant="outline" onClick={() => setShowWalletHelp((p) => !p)}>
                  ✦ Get a Wallet
                </Btn>
              </>
            ) : (
              <Btn variant="success" className="cursor-default">
                <Check size={13} strokeWidth={3} /> {shortAddr(address || "")} · Connected
              </Btn>
            )}
          </div>

          {showWalletHelp && !isConnected && (
            <div className="mt-4 rounded-xl border border-border bg-secondary p-4">
              <div className="mb-2 text-xs font-bold text-foreground">Choose a wallet to get started:</div>
              <div className="flex flex-wrap gap-2">
                {WALLET_LINKS.map((w) => (
                  <a
                    key={w.name}
                    href={w.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {w.name} ↗
                  </a>
                ))}
              </div>
            </div>
          )}
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
