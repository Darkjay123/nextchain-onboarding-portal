// NextChain quest & credential data
export const QUESTS = [
  { id: 1, title: "Join NextChain Community", desc: "Follow and join the NextChain Telegram & Discord", points: 20, cat: "Community" },
  { id: 2, title: "Attend ONBOARD DELSU", desc: "Physical or virtual attendance at the campus event", points: 40, cat: "Event" },
  { id: 3, title: "Complete Web3 Basics Module", desc: "Finish the intro learning track on Base", points: 30, cat: "Learning" },
  { id: 4, title: "Post a recap / reflection", desc: "Tweet or write a short reflection on your experience", points: 20, cat: "Content" },
  { id: 5, title: "Complete an Onchain Action", desc: "Swap, bridge, or mint something live on Base", points: 50, cat: "Onchain" },
] as const;

export const CREDENTIALS = [
  { id: "onboard", title: "ONBOARD DELSU Participant", desc: "Verified attendance at the NextChain campus onboarding event.", req: 60, emoji: "🎟️", tag: "Event Badge" },
  { id: "web3basics", title: "Web3 Basics Graduate", desc: "Completed the NextChain introductory Web3 learning track.", req: 110, emoji: "📚", tag: "Learning" },
  { id: "builder", title: "Campus Builder Cohort", desc: "Active contributor in the NextChain campus ecosystem.", req: 160, emoji: "⚒️", tag: "Builder" },
] as const;

export const STEPS = [
  { n: 1, label: "Land on portal" },
  { n: 2, label: "Connect wallet" },
  { n: 3, label: "Complete quests" },
  { n: 4, label: "Admin verifies" },
  { n: 5, label: "Claim credential" },
  { n: 6, label: "Build rep onchain" },
] as const;

export const DEMO_ADDR = "0x8F31B7A1E2c0b0D6F7a2E8C43d2A12f6A9C4D711";

export const shortAddr = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

export const MAX_POINTS = QUESTS.reduce((s, q) => s + q.points, 0);
