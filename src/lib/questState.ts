import { type QuestStatus } from "./data";

export interface QuestState {
  status: QuestStatus;
  submittedData?: string; // link or tx hash
  linkOpened?: boolean; // for social quests
}

export type QuestStates = Record<string, QuestState>;

export const initialQuestStates = (): QuestStates => ({});

export const getQuestState = (states: QuestStates, questId: string): QuestState => {
  return states[questId] || { status: "available" };
};

export const updateQuestState = (
  states: QuestStates,
  questId: string,
  update: Partial<QuestState>
): QuestStates => {
  const current = getQuestState(states, questId);
  return { ...states, [questId]: { ...current, ...update } };
};
