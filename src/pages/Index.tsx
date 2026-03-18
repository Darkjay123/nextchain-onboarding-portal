import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogoFull } from "@/components/nc/Logo";
import { Chip } from "@/components/nc/Chip";
import { Btn } from "@/components/nc/Btn";
import { HeroSection } from "@/components/nc/HeroSection";
import { FlowSection } from "@/components/nc/FlowSection";
import { StatsRow } from "@/components/nc/StatsRow";
import { QuestsSection } from "@/components/nc/QuestsSection";
import { ProfileCard } from "@/components/nc/ProfileCard";
import { AdminPanel } from "@/components/nc/AdminPanel";
import { CredentialsSection } from "@/components/nc/CredentialsSection";
import { QUESTS } from "@/lib/data";

export default function NextChainPortal() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);
  const [adminVerified, setAdminVerified] = useState(false);
  const [minted, setMinted] = useState<Record<string, boolean>>({});
  const [showAdmin, setShowAdmin] = useState(false);

  const pts = useMemo(
    () => QUESTS.filter((q) => completed.includes(q.id)).reduce((s, q) => s + q.points, 0),
    [completed]
  );

  const step = useMemo(() => {
    if (Object.values(minted).some(Boolean)) return 6;
    if (adminVerified) return 5;
    if (completed.length > 0) return 4;
    if (walletConnected) return 3;
    return 2;
  }, [walletConnected, completed, adminVerified, minted]);

  const toggle = (id: number) => {
    setCompleted((p) => (p.includes(id) ? p.filter((q) => q !== id) : [...p, id]));
    setAdminVerified(false);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-7 text-foreground md:px-5">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-3.5">
        {/* Navbar */}
        <div className="mb-1.5 flex items-center justify-between">
          <LogoFull size={30} />
          <div className="flex items-center gap-2.5">
            <Chip variant="dim">Education · Culture · Community</Chip>
            <Btn
              variant={showAdmin ? "danger" : "ghost"}
              onClick={() => setShowAdmin((p) => !p)}
              className="px-3.5 py-2 text-xs"
            >
              {showAdmin ? "✕ Admin" : "⚙ Admin"}
            </Btn>
          </div>
        </div>

        <HeroSection
          walletConnected={walletConnected}
          onConnect={() => setWalletConnected(true)}
          onCreate={() => setWalletConnected(true)}
        />
        <FlowSection step={step} />
        <StatsRow pts={pts} done={completed.length} minted={minted} />

        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-[1.15fr_0.85fr]">
          <QuestsSection completed={completed} onToggle={toggle} walletConnected={walletConnected} />
          <div className="flex flex-col gap-3.5">
            <ProfileCard walletConnected={walletConnected} pts={pts} />
            <AnimatePresence>
              {showAdmin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                >
                  <AdminPanel
                    completed={completed}
                    adminVerified={adminVerified}
                    onVerify={() => setAdminVerified(true)}
                    onReset={() => {
                      setAdminVerified(false);
                      setMinted({});
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <CredentialsSection
          pts={pts}
          walletConnected={walletConnected}
          adminVerified={adminVerified}
          minted={minted}
          onMint={(id) => setMinted((p) => ({ ...p, [id]: true }))}
        />

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-border pt-5">
          <LogoFull size={20} />
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground/40">
            Building the next generation of Web3 leaders · Base Network · MVP Demo
          </div>
          <Chip variant="dim">Nigeria → Africa</Chip>
        </div>
      </div>
    </div>
  );
}
