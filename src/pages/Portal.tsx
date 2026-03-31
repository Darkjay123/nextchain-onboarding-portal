import { useState, useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import { LogoFull } from "@/components/nc/Logo";
import { Chip } from "@/components/nc/Chip";
import { Btn } from "@/components/nc/Btn";
import { HeroSection } from "@/components/nc/HeroSection";
import { JourneyTrack } from "@/components/nc/JourneyTrack";
import { XPDisplay } from "@/components/nc/XPDisplay";
import { QuestsSection } from "@/components/nc/QuestsSection";
import { ProfileCard } from "@/components/nc/ProfileCard";
import { AdminPanel } from "@/components/nc/AdminPanel";
import { CredentialsSection } from "@/components/nc/CredentialsSection";
import { NCCard } from "@/components/nc/NCCard";
import { QUESTS, isAdmin, ADMIN_WALLET, CREDENTIALS } from "@/lib/data";
import { getQuestState } from "@/lib/questState";
import { getXP, getLevelInfo } from "@/lib/xp";
import { useWalletState } from "@/hooks/useWalletState";

export default function Portal() {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
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
  const xp = useMemo(() => getXP(questStates), [questStates]);
  const levelInfo = useMemo(() => getLevelInfo(xp), [xp]);

  const step = useMemo(() => {
    const hasIssued = Object.values(credentialRecords).some((c) => c.issued);
    if (hasIssued) return 5;
    const hasEligible = Object.values(credentialRecords).some((c) => c.eligible);
    if (hasEligible) return 4;
    const hasVerified = QUESTS.some((q) => getQuestState(questStates, q.id).status === "verified");
    if (hasVerified) return 3;
    if (isConnected) return 2;
    return 1;
  }, [isConnected, questStates, credentialRecords]);

  const issuedCount = useMemo(
    () => Object.values(credentialRecords).filter((c) => c.issued).length,
    [credentialRecords]
  );

  return (
    <div className="min-h-screen bg-background px-4 py-7 text-foreground md:px-5">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-3.5">
        {/* Navbar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-1.5 flex items-center justify-between"
        >
          <button onClick={() => navigate("/")} className="transition-opacity hover:opacity-80">
            <LogoFull size={30} />
          </button>
          <div className="flex items-center gap-2.5">
            {isConnected && <XPDisplay xp={xp} compact />}
            <Chip variant="dim">Portal</Chip>
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
        </motion.div>

        <HeroSection />

        {/* Journey Track */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <NCCard>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[15px] font-bold text-foreground">Your Journey</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Level {levelInfo.level} · {levelInfo.title}
                </div>
              </div>
              <div className="text-right">
                <span className="tabular text-xl font-black text-primary">{xp}</span>
                <span className="text-xs text-muted-foreground/50"> XP</span>
              </div>
            </div>
            <JourneyTrack step={step} />
          </NCCard>
        </motion.div>

        {/* XP + Stats */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { icon: "⚡", val: `${xp}`, sub: "total XP", label: "XP" },
              { icon: "📊", val: `Lv.${levelInfo.level}`, sub: levelInfo.title, label: "Level" },
              { icon: "📋", val: `${QUESTS.filter((q) => getQuestState(questStates, q.id).status === "verified").length}/${QUESTS.length}`, sub: "quests done", label: "Quests" },
              { icon: "🏅", val: `${issuedCount}/${CREDENTIALS.length}`, sub: "credentials", label: "Credentials" },
            ].map((item) => (
              <NCCard key={item.label} className="p-4 text-center">
                <div className="mb-2 text-xl">{item.icon}</div>
                <div className="tabular text-[22px] font-black text-primary" style={{ letterSpacing: "-0.03em" }}>
                  {item.val}
                </div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">{item.sub}</div>
              </NCCard>
            ))}
          </div>
        </motion.div>

        {/* XP Progress Card */}
        {isConnected && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <NCCard glow>
              <XPDisplay xp={xp} />
            </NCCard>
          </motion.div>
        )}

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
                    onUpdateCredential={updateCredentialStatus}
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
          totalPts={xp}
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
