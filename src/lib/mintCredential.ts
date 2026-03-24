import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI, BASE_MAINNET_CHAIN_ID } from "./nextchainContract";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface MintResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export async function connectWallet(): Promise<{ address: string } | { error: string }> {
  if (typeof window === "undefined" || !window.ethereum) {
    return { error: "No wallet detected. Please install MetaMask or a compatible wallet." };
  }

  try {
    const provider = new BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();

    if (Number(network.chainId) !== BASE_MAINNET_CHAIN_ID) {
      return { error: "Please switch your wallet to Base Mainnet (Chain 8453) to continue." };
    }

    const signer = await provider.getSigner();
    return { address: await signer.getAddress() };
  } catch (err: any) {
    if (err?.code === 4001) {
      return { error: "Wallet connection was rejected." };
    }
    return { error: err?.message || "Failed to connect wallet." };
  }
}

export async function mintCredential(recipientAddress: string): Promise<MintResult> {
  if (typeof window === "undefined" || !window.ethereum) {
    return { success: false, error: "No wallet detected. Please install MetaMask or a compatible wallet." };
  }

  try {
    const provider = new BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();

    if (Number(network.chainId) !== BASE_MAINNET_CHAIN_ID) {
      return { success: false, error: "Please switch your wallet to Base Mainnet (Chain 8453) to continue." };
    }

    const signer = await provider.getSigner();
    const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    const tx = await contract.mint(recipientAddress);
    const receipt = await tx.wait();

    return { success: true, txHash: receipt.hash };
  } catch (err: any) {
    // Handle onlyOwner revert
    if (
      err?.code === "CALL_EXCEPTION" ||
      err?.reason?.includes("OwnableUnauthorizedAccount") ||
      err?.message?.includes("OwnableUnauthorizedAccount") ||
      err?.data?.includes?.("0x118cdaa7")
    ) {
      return {
        success: false,
        error: "Only the admin wallet can mint this credential in the current MVP.",
      };
    }

    if (err?.code === 4001 || err?.code === "ACTION_REJECTED") {
      return { success: false, error: "Transaction was rejected by user." };
    }

    return { success: false, error: err?.shortMessage || err?.message || "Minting failed." };
  }
}
