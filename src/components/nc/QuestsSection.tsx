import { useState } from "react";
import { NCCard } from "./NCCard";
import { Chip } from "./Chip";
import { Btn } from "./Btn";
import { Bar } from "./Bar";
import { QUESTS, MAX_POINTS, type Quest } from "@/lib/data";
import { type QuestStates, getQuestState, type QuestState } from "@/lib/questState";
import { LearningModule } from "./LearningModule";

interface QuestsSectionProps {
  questStates: QuestStates;
  onQuestAction: (questId: string, action: string, data?: string) => void;
  walletConnected: boolean;
  saveLearningProgress?: (moduleId: string, score: number, passed: boolean) => void;
}

const catChip: Record<string, "green" | "bright" | "dim"> = {
  Community: "green",
  Event: "bright",
  Learning: "green",
  Content: "dim",
  Onchain: "bright",
};

const statusLabel: Record<string, { text: string; variant: "green" | "bright" | "dim" }> = {
  available: { text: "Available", variant: "dim" },
  submitted: { text: "Submitted", variant: "bright" },
  under_review: { text: "Under Review", variant: "bright" },
  verified: { text: "Verified ✓", variant: "green" },
  rejected: { text: "Rejected", variant: "dim" },
};

export function QuestsSection({ questStates, onQuestAction, walletConnected, saveLearningProgress }: QuestsSectionProps) {
  const [showLearning, setShowLearning] = useState(false);
  const [linkInputs, setLinkInputs] = useState<Record<string, string>>({});

  const pts = QUESTS.filter((q) => getQuestState(questStates, q.id).status === "verified")
    .reduce((s, q) => s + q.points, 0);
  const verifiedCount = QUESTS.filter((q) => getQuestState(questStates, q.id).status === "verified").length;

  return (
    <>
      <NCCard>
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="text-lg font-extrabold text-foreground" style={{ letterSpacing: "-0.02em" }}>
              Onboarding Quests
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Complete actions to earn points and unlock credentials.
            </div>
          </div>
          <div className="text-right">
            <span className="tabular text-2xl font-black text-primary">{pts}</span>
            <span className="text-sm text-muted-foreground/50">/{MAX_POINTS}</span>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground/50">POINTS</div>
          </div>
        </div>
        <Bar pct={(pts / MAX_POINTS) * 100} />
        <div className="mt-4 flex flex-col gap-2.5">
          {QUESTS.map((q) => {
            const state = getQuestState(questStates, q.id);
            const done = state.status === "verified";
            const sl = statusLabel[state.status] || statusLabel.available;

            return (
              <div
                key={q.id}
                className="flex flex-col rounded-xl border p-3.5 transition-all duration-200"
                style={{
                  background: done ? "hsl(150 30% 4%)" : "hsl(var(--secondary))",
                  borderColor: done ? "hsl(150 30% 12%)" : "hsl(var(--border))",
                  boxShadow: done ? "0 0 16px var(--green-glow)" : "none",
                }}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold transition-all duration-300"
                    style={{
                      background: done ? "hsl(var(--primary))" : "hsl(var(--muted))",
                      border: `1.5px solid ${done ? "hsl(var(--primary))" : "hsl(var(--border))"}`,
                      color: "hsl(var(--primary-foreground))",
                      boxShadow: done ? "0 0 10px var(--green-glow)" : "none",
                    }}
                  >
                    {done ? "✓" : ""}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{q.title}</span>
                      <Chip variant={catChip[q.cat] || "dim"}>{q.cat}</Chip>
                      {state.status !== "available" && (
                        <Chip variant={sl.variant}>{sl.text}</Chip>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{q.desc}</div>
                  </div>
                  <div className="flex-shrink-0 text-right" style={{ minWidth: 40 }}>
                    <div
                      className="tabular text-[15px] font-extrabold"
                      style={{ color: done ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.4)" }}
                    >
                      +{q.points}
                    </div>
                    <div className="text-[10px] text-muted-foreground/40">pts</div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <QuestAction
                    quest={q}
                    state={state}
                    walletConnected={walletConnected}
                    onAction={onQuestAction}
                    linkValue={linkInputs[q.id] || ""}
                    onLinkChange={(v) => setLinkInputs((p) => ({ ...p, [q.id]: v }))}
                    onOpenLearning={() => setShowLearning(true)}
                  />
                </div>

                {state.status === "rejected" && (
                  <div className="mt-2 text-xs text-destructive">
                    Quest was rejected by admin. You can resubmit.
                  </div>
                )}
              </div>
            );
          })}
          {!walletConnected && (
            <div className="py-2 text-center text-[13px] text-muted-foreground">
              Connect a wallet to begin completing quests.
            </div>
          )}
        </div>
      </NCCard>

      {showLearning && (
        <LearningModule
          onComplete={(score, passed) => {
            if (passed) {
              onQuestAction("web3_basics", "complete_quiz");
            }
            saveLearningProgress?.("web3_basics", score, passed);
          }}
          onClose={() => setShowLearning(false)}
        />
      )}
    </>
  );
}

// ─── Per-Quest Action Button ─────────────────────────────────────────────

interface QuestActionProps {
  quest: Quest;
  state: QuestState;
  walletConnected: boolean;
  onAction: (questId: string, action: string, data?: string) => void;
  linkValue: string;
  onLinkChange: (v: string) => void;
  onOpenLearning: () => void;
}

function QuestAction({ quest, state, walletConnected, onAction, linkValue, onLinkChange, onOpenLearning }: QuestActionProps) {
  if (!walletConnected) return null;

  if (state.status === "verified") {
    return (
      <Btn variant="success" disabled className="flex-shrink-0 rounded-lg px-3.5 py-1.5 text-xs">
        Verified ✓
      </Btn>
    );
  }

  if (state.status === "submitted" || state.status === "under_review") {
    return (
      <Btn variant="outline" disabled className="flex-shrink-0 rounded-lg px-3.5 py-1.5 text-xs">
        ⏳ Awaiting Review
      </Btn>
    );
  }

  if (quest.verificationMethod === "self_link") {
    return (
      <div className="flex w-full gap-2">
        <Btn
          variant="outline"
          onClick={() => {
            window.open(quest.externalLink, "_blank");
            onAction(quest.id, "open_link");
          }}
          className="flex-shrink-0 rounded-lg px-3.5 py-1.5 text-xs"
        >
          Open Link ↗
        </Btn>
        {state.linkOpened && (
          <Btn
            onClick={() => onAction(quest.id, "submit_self")}
            className="flex-shrink-0 rounded-lg px-3.5 py-1.5 text-xs"
          >
            I've Completed This
          </Btn>
        )}
      </div>
    );
  }

  if (quest.verificationMethod === "admin_only") {
    return (
      <div className="text-xs text-muted-foreground">
        🔒 Only admin can verify event attendance
      </div>
    );
  }

  if (quest.verificationMethod === "quiz") {
    return (
      <Btn
        onClick={onOpenLearning}
        className="flex-shrink-0 rounded-lg px-3.5 py-1.5 text-xs"
      >
        📚 Start Module
      </Btn>
    );
  }

  if (quest.verificationMethod === "link_submission" || quest.verificationMethod === "tx_submission") {
    const placeholder =
      quest.verificationMethod === "tx_submission"
        ? "Paste transaction hash (0x...)"
        : "Paste your post link (https://...)";
    return (
      <div className="flex w-full gap-2">
        <input
          type="text"
          value={linkValue}
          onChange={(e) => onLinkChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
        />
        <Btn
          onClick={() => {
            if (linkValue.trim()) {
              onAction(quest.id, "submit_link", linkValue.trim());
              onLinkChange("");
            }
          }}
          disabled={!linkValue.trim()}
          className="flex-shrink-0 rounded-lg px-3.5 py-1.5 text-xs"
        >
          Submit
        </Btn>
      </div>
    );
  }

  return null;
}
