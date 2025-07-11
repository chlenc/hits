import { makeAutoObservable, reaction } from "mobx";
import { disconnect } from "@wagmi/core";
import { apiService, type UserData } from "../services/api";
import RootStore from "./RootStore";
import { createWalletClient, custom } from "viem";
import { base } from "viem/chains";
import { toast } from "react-toastify";

export interface IReferralData {
  referrer?: string;
  signature?: string;
}

class ReferralStore {
  public readonly rootStore: RootStore;

  referrer?: string;
  signature?: string;
  isAuthenticating: boolean = false;
  refferals: UserData[] = [];
  userData?: {
    address: string;
    createdAt: string;
    referrer?: string;
  };

  constructor(rootStore: RootStore, initState?: IReferralData) {
    this.rootStore = rootStore;
    makeAutoObservable(this);

    if (initState != null) {
      this.referrer = initState.referrer;
      this.signature = initState.signature;
    }

    const referralFromURL = this.extractReferralFromURL();
    if (referralFromURL) {
      this.referrer = referralFromURL;
    }

    // Автоматическая аутентификация при подключении кошелька
    reaction(
      () => [
        this.rootStore.accountStore.isConnected,
        this.rootStore.accountStore.address,
      ],
      ([isConnected, address]) => {
        if (isConnected && address) {
          this.authenticateUser();
        }
      },
      { fireImmediately: true }
    );

    console.log({
      initState: initState?.referrer,
      signature: this.signature,
      url: this.extractReferralFromURL(),
      referrer: this.referrer,
    });
  }

  extractReferralFromURL = () => {
    if (typeof window === "undefined") return;
    return new URLSearchParams(window.location.search).get("ref");
  };

  copyReferralLink = async (): Promise<boolean> => {
    if (!this.referralLink) return false;

    try {
      await navigator.clipboard.writeText(this.referralLink);
      return true;
    } catch (error) {
      console.error("Error copying referral link:", error);
      return false;
    }
  };

  get referralLink() {
    return this.rootStore.accountStore.address
      ? `hits4.fun/?ref=${this.rootStore.accountStore.address.toLowerCase()}`
      : "hits4.fun";
  }

  // Проверка, может ли пользователь генерировать реферальные ссылки
  get canGenerateReferral(): boolean {
    return (
      this.rootStore.accountStore.isConnected &&
      !!this.rootStore.accountStore.address
    );
  }

  private async authenticateUser() {
    const { address, chainId, wagmiConfig } = this.rootStore.accountStore;
    if (!address || this.isAuthenticating || !wagmiConfig || !chainId) return;
    this.isAuthenticating = true;

    try {
      const { message } = await apiService.getAuthMessage();
      let signature = this.signature;
      if (!signature) {
        const walletClient = createWalletClient({
          account: address,
          chain: base,
          transport: custom(window.ethereum),
        });
        this.signature = await walletClient.signMessage({
          message,
          account: address,
        });
        signature = this.signature;
      }
      const userData = await apiService.authenticateUser(
        signature,
        address,
        this.referrer
      );
      this.userData = userData;
      const { referrals } = await apiService.getRefferals(
        signature,
        address,
        this.referrer
      );
      this.refferals = referrals;
    } catch (error: any) {
      const errorMessage = error.shortMessage ?? error.toString();
      toast.error(errorMessage);
      this.signature = undefined;
      this.referrer = undefined;
      disconnect(wagmiConfig);
    } finally {
      this.isAuthenticating = false;
    }
  }

  serialize = () => {
    return {
      referrer: this.referrer,
      signature: this.signature,
    };
  };
}

export default ReferralStore;
