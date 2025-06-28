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
    return this.rootStore.balanceStore.balances.ETH?.balance ?? 0;
  }

}
