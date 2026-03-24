import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "NextChain Portal",
  projectId: "04cdb19a5fe63e9e54b8e45d82b2a662",
  chains: [base],
  ssr: false,
});
