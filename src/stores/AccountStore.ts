import type { Config } from "wagmi";
import { NetworkConfig } from "../configs/networkConfig";
import { makeAutoObservable, reaction } from "mobx";
import { disconnect } from "@wagmi/core";
import { apiService, type UserData } from "../services/api";
import RootStore from "./RootStore";
import { createWalletClient, custom } from "viem";
import { base } from "viem/chains";
import { toast } from "react-toastify";

export interface IAccountStoreInitState {
  referrer?: string;
  signatures?: Record<string, string>;
}

class AccountStore {
  public readonly rootStore: RootStore;
  address?: `0x${string}`;
  isConnected: boolean = false;
  isProcessing: boolean = false;
  chainId: number | null = null;
  wagmiConfig: Config | null = null;

  isAuthenticating: boolean = false;
  signatures: Record<string, string> = {};
  referrer?: string;
  refferals: UserData[] = [];
  userData?: {
    address: string;
    createdAt: string;
    referrer?: string;
  };

  constructor(rootStore: RootStore, initState?: IAccountStoreInitState) {
    this.rootStore = rootStore;
    makeAutoObservable(this);

    if (initState != null) {
      this.referrer = initState.referrer;
      this.signatures = initState.signatures ?? {};
    }

    const referralFromURL = extractReferralFromURL();
    if (referralFromURL) {
      this.referrer = referralFromURL;
    }

    // Автоматическая аутентификация при подключении кошелька
    reaction(
      () => [this.isConnected, this.address],
      ([isConnected, address]) => {
        if (isConnected && address) this.authenticateUser();
      },
      { fireImmediately: true }
    );

    console.log({
      initState: initState?.referrer,
      signatures: JSON.stringify(this.signatures),
      url: extractReferralFromURL(),
      referrer: this.referrer,
    });
  }

  setAddress = (address?: `0x${string}`) => (this.address = address);
  setIsConnected = (isConnected: boolean) => (this.isConnected = isConnected);
  setChainId = (chainId: number | null) => (this.chainId = chainId);
  setWagmiConfig = (config: Config) => (this.wagmiConfig = config);
  get networkConfig() {
    return Object.values(NetworkConfig).find(
      (network) => network.chainId === this.chainId
    );
  }
  get referralLink() {
    return this.rootStore.accountStore.address
      ? `hits4.fun/?ref=${this.rootStore.accountStore.address.toLowerCase()}`
      : "hits4.fun";
  }

  private async authenticateUser() {
    const { address, chainId, wagmiConfig } = this.rootStore.accountStore;
    if (!address || this.isAuthenticating || !wagmiConfig || !chainId) return;
    this.isAuthenticating = true;

    try {
      const { message } = await apiService.getAuthMessage();
      let signature = this.signatures[address];
      if (!signature) {
        const walletClient = createWalletClient({
          account: address,
          chain: base,
          transport: custom(window.ethereum),
        });
        this.signatures[address] = await walletClient.signMessage({
          message,
          account: address,
        });
        signature = this.signatures[address];
      }
      const userData = await apiService.authenticateUser(
        signature,
        address,
        this.referrer
      );
      this.userData = userData;
      const { referrals } = await apiService.getReferrals(signature, address);
      this.refferals = referrals;
    } catch (error: any) {
      const errorMessage = error.shortMessage ?? error.toString();
      toast.error(errorMessage);
      this.referrer = undefined;
      disconnect(wagmiConfig);
    } finally {
      this.isAuthenticating = false;
    }
  }

  serialize = () => {
    return {
      referrer: this.referrer,
      signatures: this.signatures,
    };
  };
}

const extractReferralFromURL = () => {
  if (typeof window === "undefined") return;
  return new URLSearchParams(window.location.search).get("ref");
};

export default AccountStore;
