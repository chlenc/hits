import { makeAutoObservable } from "mobx";
import React, { type PropsWithChildren, useMemo } from "react";
import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  parseEther,
} from "viem";
import { TICKET_PRICE } from "../../configs/networkConfig";
import RootStore from "../../stores/RootStore";
import { useStores } from "../../stores/useStores";
import { useVM } from "../../stores/useVM";
import BN from "../../utils/BN";

const ctx = React.createContext<PresaleVM | null>(null);
export const PresaleVMProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const rootStore = useStores();
  const store = useMemo(() => new PresaleVM(rootStore), [rootStore]);
  return <ctx.Provider value={store}>{children}</ctx.Provider>;
};

export const usePresaleVM = () => useVM(ctx);

class PresaleVM {
  public rootStore: RootStore;

  // State
  ticketAmount: number = 1;
  isLoading: boolean = false;
  error: string | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  // Actions
  setTicketAmount = (amount: number) => (this.ticketAmount = amount);

  setIsLoading = (loading: boolean) => (this.isLoading = loading);

  setError = (error: string | null) => (this.error = error);

  incrementTicketAmount = () => (this.ticketAmount += 1);

  decrementTicketAmount = () =>
    (this.ticketAmount = this.ticketAmount > 1 ? this.ticketAmount - 1 : 1);

  resetTicketAmount = () => (this.ticketAmount = 1);

  get ticketBalance() {
    const balances = this.rootStore.balanceStore.balances;
    return BN.formatUnits(balances.TICKET?.balance ?? 0)
      .div(TICKET_PRICE)
      .toNumber();
  }

  get ethBalance() {
    return this.rootStore.balanceStore.balances.ETH?.balance ?? "0";
  }

  handleBuyTickets = async () => {
    this.setError(null);
    // Check if user has enough balance
    const requiredBalance = this.ticketAmount * TICKET_PRICE;
    const currentBalance = Number(this.ethBalance);

    if (currentBalance < requiredBalance) {
      this.setError("Insufficient balance");
      return;
    }
    this.setIsLoading(true);
    try {
      const { networkConfig, address } = this.rootStore.accountStore;
      if (!networkConfig || !address) {
        throw new Error("Network config or address not available");
      }

      const { chainId, contract, rpc } = networkConfig;

      const client = createPublicClient({
        chain: {
          id: chainId,
          name: networkConfig.name,
          nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
          rpcUrls: { default: { http: [rpc] } },
        },
        transport: http(),
      });

      const walletClient = createWalletClient({
        account: address as `0x${string}`,
        chain: {
          id: chainId,
          name: networkConfig.name,
          nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
          rpcUrls: { default: { http: [rpc] } },
        },
        transport: custom(window.ethereum),
      });

      const hash = await walletClient.sendTransaction({
        to: contract as `0x${string}`,
        value: parseEther((this.ticketAmount * TICKET_PRICE).toString()),
      });

      // Wait for transaction confirmation
      const receipt = await client.waitForTransactionReceipt({ hash });

      if (receipt.status === "success") {
        // Update balances after successful transaction
        await this.rootStore.balanceStore.updateTokenBalances();
      }

      // Reset ticket amount after initiating purchase
      this.setTicketAmount(1);
    } catch (err) {
      console.error("Error buying tickets:", err);
      this.setError(
        err instanceof Error ? err.message : "Failed to buy tickets"
      );
    } finally {
      this.setIsLoading(false);
    }
  };
}
