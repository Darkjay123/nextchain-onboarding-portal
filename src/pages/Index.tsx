import { useState, useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAccount } from "wagmi";
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
import { QUESTS, isAdmin } from "@/lib/data";
import { getQuestState } from "@/lib/questState";
import { useWalletState } from "@/hooks/useWalletState";

export default function NextChainPortal() {
  const { address, isConnected } = useAccount();
  const [showAdmin, setShowAdmin] = useState(false);

  const {
    questStates,
    credentialRecords,
    learningRecords,
    loading,
    handleQuestAction,
    adminVerifyQuest,
    adminRejectQuest,
    updateCredentialStatus,
    saveLearningProgress,
    allSubmissions,
    loadAllSubmissions,
  } = useWalletState(address);

  const walletIsAdmin = isAdmin(address);

  const pts = useMemo(
    () =>
      QUESTS.filter((q) => getQuestState(questStates, q.id).status === "verified").reduce(
        (s, q) => s + q.points,
        0
      ),
    [questStates]
  );

  const step = useMemo(() => {
    const hasIssued = Object.values(credentialRecords).some((c) => c.issued);
    if (hasIssued) return 6;
    const hasEligible = Object.values(credentialRecords).some((c) => c.eligible);
    if (hasEligible) return 5;
    const hasVerified = QUESTS.some((q) => getQuestState(questStates, q.id).status === "verified");
    if (hasVerified) return 4;
    if (isConnected) return 3;
    return 2;
  }, [isConnected, questStates, credentialRecords]);

  return (
    <div className="min-h-screen bg-background px-4 py-7 text-foreground md:px-5">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-3.5">
        {/* Navbar */}
        <div className="mb-1.5 flex items-center justify-between">
          <LogoFull size={30} />
          <div className="flex items-center gap-2.5">
            <Chip variant="dim">Education · Culture · Community</Chip>
            {isConnected && walletIsAdmin && (
              <Btn
                variant={showAdmin ? "danger" : "ghost"}
                onClick={() => {
                  setShowAdmin((p) => !p);
                  if (!showAdmin) loadAllSubmissions();
                }}
                className="px-3.5 py-2 text-xs"
              >
                {showAdmin ? "✕ Admin" : "⚙ Admin"}
              </Btn>
            )}
          </div>
        </div>

        <HeroSection />
        <FlowSection step={step} />
        <StatsRow questStates={questStates} credentialRecords={credentialRecords} />

        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-[1.15fr_0.85fr]">
          <QuestsSection
            questStates={questStates}
            onQuestAction={handleQuestAction}
            walletConnected={isConnected}
            saveLearningProgress={saveLearningProgress}
          />
          <div className="flex flex-col gap-3.5">
            <ProfileCard walletConnected={isConnected} questStates={questStates} />
            <AnimatePresence>
              {showAdmin && walletIsAdmin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                >
                  <AdminPanel
                    questStates={questStates}
                    studentAddress={address || null}
                    credentialRecords={credentialRecords}
                    onVerifyQuest={adminVerifyQuest}
                    onRejectQuest={adminRejectQuest}
                    onApproveCredential={(credId) =>
                      updateCredentialStatus(credId, { eligible: true })
                    }
                    allSubmissions={allSubmissions}
                    onRefreshSubmissions={loadAllSubmissions}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <CredentialsSection
          questStates={questStates}
          totalPts={pts}
          walletConnected={isConnected}
          walletAddress={address || null}
          credentialRecords={credentialRecords}
          isAdmin={walletIsAdmin}
          onUpdateCredential={updateCredentialStatus}
        />

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-border pt-5">
          <LogoFull size={20} />
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground/40">
            Building the next generation of Web3 leaders · Base Network
          </div>
          <Chip variant="dim">Nigeria → Africa</Chip>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <div className="text-sm text-muted-foreground animate-pulse">Loading your progress…</div>
        </div>
      )}
    </div>
  );
}
