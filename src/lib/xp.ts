// XP & Level system for NextChain portal
import { QUESTS } from "./data";
import { type QuestStates, getQuestState } from "./questState";

export const XP_PER_POINT = 1; // 1 quest point = 1 XP for simplicity

export interface LevelInfo {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
}

export const LEVELS: LevelInfo[] = [
  { level: 1, title: "Explorer", minXP: 0, maxXP: 19 },
  { level: 2, title: "Learner", minXP: 20, maxXP: 49 },
  { level: 3, title: "Contributor", minXP: 50, maxXP: 99 },
  { level: 4, title: "Builder", minXP: 100, maxXP: 139 },
  { level: 5, title: "Leader", minXP: 140, maxXP: 999 },
];

export function getXP(questStates: QuestStates): number {
  return QUESTS.filter((q) => getQuestState(questStates, q.id).status === "verified")
    .reduce((s, q) => s + q.points, 0);
}

export function getLevelInfo(xp: number): LevelInfo {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getLevelProgress(xp: number): number {
  const info = getLevelInfo(xp);
  const range = info.maxXP - info.minXP + 1;
  const progress = xp - info.minXP;
  return Math.min((progress / range) * 100, 100);
}
