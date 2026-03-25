// NextChain quest & credential data

// ─── Admin Config ────────────────────────────────────────────────────────
export const ADMIN_WALLET = "0x46daec8fe29132eee301636100c9b5f7af0f058e";

export const isAdmin = (address: string | undefined): boolean => {
  if (!address) return false;
  return address.toLowerCase() === ADMIN_WALLET.toLowerCase();
};

// ─── Quest Types ─────────────────────────────────────────────────────────
export type QuestType = "social" | "event" | "learning" | "content" | "onchain";
export type QuestStatus = "locked" | "available" | "submitted" | "under_review" | "verified" | "rejected";

export interface Quest {
  id: string;
  title: string;
  desc: string;
  points: number;
  type: QuestType;
  verificationMethod: "self_link" | "admin_only" | "quiz" | "link_submission" | "tx_submission";
  externalLink?: string;
  cat: string;
}

export const QUESTS: Quest[] = [
  {
    id: "follow_x",
    title: "Follow NextChain on X",
    desc: "Follow the official NextChain account on X (Twitter)",
    points: 10,
    type: "social",
    verificationMethod: "self_link",
    externalLink: "https://x.com/Nextchain1",
    cat: "Community",
  },
  {
    id: "join_whatsapp",
    title: "Join NextChain WhatsApp",
    desc: "Join the NextChain community WhatsApp group",
    points: 10,
    type: "social",
    verificationMethod: "self_link",
    externalLink: "https://chat.whatsapp.com/GH3TV1TmQdt7UtCR1fQeTs",
    cat: "Community",
  },
  {
    id: "attend_event",
    title: "Attend ONBOARD DELSU",
    desc: "Physical or virtual attendance at the campus event — admin verified only",
    points: 40,
    type: "event",
    verificationMethod: "admin_only",
    cat: "Event",
  },
  {
    id: "web3_basics",
    title: "Complete Web3 Basics Module",
    desc: "Finish the in-app introductory Web3 learning track and pass the quiz",
    points: 30,
    type: "learning",
    verificationMethod: "quiz",
    cat: "Learning",
  },
  {
    id: "post_reflection",
    title: "Post a Reflection",
    desc: "Tweet or write a short reflection on your Web3 journey and paste the link",
    points: 20,
    type: "content",
    verificationMethod: "link_submission",
    cat: "Content",
  },
  {
    id: "onchain_action",
    title: "Complete an Onchain Action",
    desc: "Swap, bridge, or mint something live on Base and paste the transaction hash",
    points: 50,
    type: "onchain",
    verificationMethod: "tx_submission",
    cat: "Onchain",
  },
];

// ─── Credentials ─────────────────────────────────────────────────────────
export interface Credential {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  tag: string;
  requiredQuests: string[];
  requiresAdminApproval: boolean;
  minPoints?: number;
}

export const CREDENTIALS: Credential[] = [
  {
    id: "onboard",
    title: "ONBOARD DELSU Participant",
    desc: "Verified attendance at the NextChain campus onboarding event.",
    emoji: "🎟️",
    tag: "Event Badge",
    requiredQuests: ["follow_x", "join_whatsapp", "attend_event"],
    requiresAdminApproval: false,
  },
  {
    id: "web3basics",
    title: "Web3 Basics Graduate",
    desc: "Completed the NextChain introductory Web3 learning track.",
    emoji: "📚",
    tag: "Learning",
    requiredQuests: ["web3_basics", "onchain_action"],
    requiresAdminApproval: false,
  },
  {
    id: "builder",
    title: "Campus Builder Cohort",
    desc: "Active contributor in the NextChain campus ecosystem.",
    emoji: "⚒️",
    tag: "Builder",
    requiredQuests: ["post_reflection", "onchain_action"],
    requiresAdminApproval: true,
    minPoints: 100,
  },
];

// ─── Steps ───────────────────────────────────────────────────────────────
export const STEPS = [
  { n: 1, label: "Land on portal" },
  { n: 2, label: "Connect wallet" },
  { n: 3, label: "Complete quests" },
  { n: 4, label: "Admin verifies" },
  { n: 5, label: "Claim credential" },
  { n: 6, label: "Build rep onchain" },
] as const;

export const shortAddr = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

export const MAX_POINTS = QUESTS.reduce((s, q) => s + q.points, 0);

export const CONTRACT_ADDRESS = "0xF34Dabf3107b916B085BFafF8FEe16938A44619e";

// ─── Learning Module ─────────────────────────────────────────────────────
export const LEARNING_SECTIONS = [
  {
    title: "What is Blockchain?",
    content:
      "A blockchain is a decentralized, distributed digital ledger that records transactions across many computers. Each block contains a list of transactions and is cryptographically linked to the previous block, forming a chain. This makes it nearly impossible to alter past records without changing every subsequent block. Blockchains enable trustless, transparent, and tamper-proof record-keeping without a central authority.",
  },
  {
    title: "What is a Wallet?",
    content:
      "A crypto wallet is a tool that lets you interact with blockchain networks. It stores your private keys — secret codes that prove ownership of your digital assets. Wallets come in many forms: browser extensions (like MetaMask), mobile apps, and hardware devices. Your wallet address is like your public account number that others can send assets to, while your private key is like your password that you must never share.",
  },
  {
    title: "What is Base?",
    content:
      "Base is a secure, low-cost Ethereum Layer 2 (L2) network built by Coinbase. It's designed to make it easy and affordable to build and use decentralized applications. Base settles transactions on Ethereum mainnet for security while offering faster speeds and lower gas fees. It's fully compatible with Ethereum tools, so developers can deploy existing smart contracts with minimal changes.",
  },
  {
    title: "What is an Onchain Transaction?",
    content:
      "An onchain transaction is any action that gets recorded on the blockchain. This includes sending tokens, swapping assets on a decentralized exchange, minting NFTs, or interacting with smart contracts. Every onchain transaction requires a small gas fee paid in the network's native token (ETH on Base). Once confirmed, the transaction becomes a permanent, publicly verifiable record on the blockchain.",
  },
];

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "What does a crypto wallet primarily store?",
    options: ["Cryptocurrency coins", "Private keys", "Your email address", "Blockchain blocks"],
    correctIndex: 1,
  },
  {
    question: "What network is Base built on top of?",
    options: ["Solana", "Bitcoin", "Ethereum", "Polygon"],
    correctIndex: 2,
  },
  {
    question: "What is required to complete an onchain transaction?",
    options: ["A social media account", "An email verification", "A gas fee in ETH", "A bank transfer"],
    correctIndex: 2,
  },
  {
    question: "What makes blockchain records difficult to alter?",
    options: [
      "They are stored on one computer",
      "Each block is cryptographically linked to the previous one",
      "They require a password",
      "They are stored in the cloud",
    ],
    correctIndex: 1,
  },
  {
    question: "Who built Base?",
    options: ["Binance", "OpenAI", "Coinbase", "Meta"],
    correctIndex: 2,
  },
];

export const QUIZ_PASS_THRESHOLD = 3; // out of 5
