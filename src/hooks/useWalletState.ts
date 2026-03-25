import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QUESTS, CREDENTIALS, type Quest } from "@/lib/data";
import { type QuestStates, type QuestState, getQuestState } from "@/lib/questState";

export interface CredentialRecord {
  credential_id: string;
  eligible: boolean;
  issued: boolean;
  token_id: string | null;
  tx_hash: string | null;
  issued_at: string | null;
}

export interface LearningRecord {
  module_id: string;
  completed: boolean;
  quiz_score: number | null;
  passed: boolean;
}

export function useWalletState(walletAddress: string | undefined) {
  const [questStates, setQuestStates] = useState<QuestStates>({});
  const [credentialRecords, setCredentialRecords] = useState<Record<string, CredentialRecord>>({});
  const [learningRecords, setLearningRecords] = useState<Record<string, LearningRecord>>({});
  const [loading, setLoading] = useState(false);
  const loadedWallet = useRef<string | null>(null);

  const addr = walletAddress?.toLowerCase() || null;

  // ─── Load all state from Supabase ─────────────────────────────────────
  const loadState = useCallback(async (wallet: string) => {
    setLoading(true);
    try {
      // Ensure profile exists
      await supabase
        .from("profiles")
        .upsert({ wallet_address: wallet }, { onConflict: "wallet_address" });

      // Fetch quest progress
      const { data: quests } = await supabase
        .from("quest_progress")
        .select("*")
        .eq("wallet_address", wallet);

      if (quests) {
        const qs: QuestStates = {};
        for (const q of quests) {
          qs[q.quest_id] = {
            status: (q.status as QuestState["status"]) || "available",
            submittedData: q.submission_value || undefined,
            linkOpened: q.link_opened || false,
          };
        }
        setQuestStates(qs);
      }

      // Fetch learning progress
      const { data: learning } = await supabase
        .from("learning_progress")
        .select("*")
        .eq("wallet_address", wallet);

      if (learning) {
        const lr: Record<string, LearningRecord> = {};
        for (const l of learning) {
          lr[l.module_id] = {
            module_id: l.module_id,
            completed: l.completed || false,
            quiz_score: l.quiz_score,
            passed: l.passed || false,
          };
        }
        setLearningRecords(lr);
      }

      // Fetch credential status
      const { data: creds } = await supabase
        .from("credential_status")
        .select("*")
        .eq("wallet_address", wallet);

      if (creds) {
        const cr: Record<string, CredentialRecord> = {};
        for (const c of creds) {
          cr[c.credential_id] = {
            credential_id: c.credential_id,
            eligible: c.eligible || false,
            issued: c.issued || false,
            token_id: c.token_id,
            tx_hash: c.tx_hash,
            issued_at: c.issued_at,
          };
        }
        setCredentialRecords(cr);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (addr && addr !== loadedWallet.current) {
      loadedWallet.current = addr;
      loadState(addr);
    }
    if (!addr) {
      loadedWallet.current = null;
      setQuestStates({});
      setCredentialRecords({});
      setLearningRecords({});
    }
  }, [addr, loadState]);

  // ─── Quest actions ────────────────────────────────────────────────────
  const saveQuestProgress = useCallback(
    async (questId: string, update: Partial<QuestState>) => {
      if (!addr) return;
      const quest = QUESTS.find((q) => q.id === questId);
      const current = getQuestState(questStates, questId);
      const merged = { ...current, ...update };

      setQuestStates((prev) => ({ ...prev, [questId]: merged }));

      await supabase.from("quest_progress").upsert(
        {
          wallet_address: addr,
          quest_id: questId,
          quest_type: quest?.type || null,
          status: merged.status,
          submission_value: merged.submittedData || null,
          link_opened: merged.linkOpened || false,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "wallet_address,quest_id" }
      );
    },
    [addr, questStates]
  );

  const handleQuestAction = useCallback(
    (questId: string, action: string, data?: string) => {
      switch (action) {
        case "open_link":
          saveQuestProgress(questId, { linkOpened: true });
          break;
        case "submit_self":
          saveQuestProgress(questId, { status: "submitted" });
          break;
        case "submit_link":
          saveQuestProgress(questId, { status: "submitted", submittedData: data });
          break;
        case "complete_quiz":
          saveQuestProgress(questId, { status: "verified" });
          break;
      }
    },
    [saveQuestProgress]
  );

  // ─── Admin actions ────────────────────────────────────────────────────
  const adminVerifyQuest = useCallback(
    async (questId: string, targetWallet?: string) => {
      const wallet = targetWallet?.toLowerCase() || addr;
      if (!wallet) return;

      setQuestStates((prev) => ({
        ...prev,
        [questId]: { ...getQuestState(prev, questId), status: "verified" as const },
      }));

      await supabase.from("quest_progress").upsert(
        {
          wallet_address: wallet,
          quest_id: questId,
          status: "verified",
          admin_verified: true,
          verified_by: addr,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "wallet_address,quest_id" }
      );
    },
    [addr]
  );

  const adminRejectQuest = useCallback(
    async (questId: string, targetWallet?: string) => {
      const wallet = targetWallet?.toLowerCase() || addr;
      if (!wallet) return;

      setQuestStates((prev) => ({
        ...prev,
        [questId]: { ...getQuestState(prev, questId), status: "rejected" as const, submittedData: undefined },
      }));

      await supabase.from("quest_progress").upsert(
        {
          wallet_address: wallet,
          quest_id: questId,
          status: "rejected",
          submission_value: null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "wallet_address,quest_id" }
      );
    },
    [addr]
  );

  // ─── Credential actions ───────────────────────────────────────────────
  const updateCredentialStatus = useCallback(
    async (credId: string, update: Partial<CredentialRecord>, targetWallet?: string) => {
      const wallet = targetWallet?.toLowerCase() || addr;
      if (!wallet) return;

      setCredentialRecords((prev) => ({
        ...prev,
        [credId]: { ...prev[credId], credential_id: credId, ...update } as CredentialRecord,
      }));

      await supabase.from("credential_status").upsert(
        {
          wallet_address: wallet,
          credential_id: credId,
          ...update,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "wallet_address,credential_id" }
      );
    },
    [addr]
  );

  // ─── Learning actions ─────────────────────────────────────────────────
  const saveLearningProgress = useCallback(
    async (moduleId: string, quizScore: number, passed: boolean) => {
      if (!addr) return;

      const record: LearningRecord = {
        module_id: moduleId,
        completed: passed,
        quiz_score: quizScore,
        passed,
      };

      setLearningRecords((prev) => ({ ...prev, [moduleId]: record }));

      await supabase.from("learning_progress").upsert(
        {
          wallet_address: addr,
          module_id: moduleId,
          completed: passed,
          quiz_score: quizScore,
          passed,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "wallet_address,module_id" }
      );
    },
    [addr]
  );

  // ─── Admin: fetch all submissions across wallets ──────────────────────
  const [allSubmissions, setAllSubmissions] = useState<
    Array<{ wallet_address: string; quest_id: string; status: string; submission_value: string | null }>
  >([]);

  const loadAllSubmissions = useCallback(async () => {
    const { data } = await supabase
      .from("quest_progress")
      .select("wallet_address, quest_id, status, submission_value")
      .in("status", ["submitted", "under_review"]);
    if (data) setAllSubmissions(data);
  }, []);

  return {
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
    reload: () => addr && loadState(addr),
  };
}
