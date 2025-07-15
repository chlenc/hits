import { makeAutoObservable } from "mobx";
import React, { type PropsWithChildren, useMemo } from "react";
import { TICKET_PRICE } from "../../configs/networkConfig";
import RootStore from "../../stores/RootStore";
import { useStores } from "../../stores/useStores";
import { useVM } from "../../stores/useVM";
import BN from "../../utils/BN";

const ctx = React.createContext<PaymentScreenVM | null>(null);
export const PaymentScreenVMProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const rootStore = useStores();
  const store = useMemo(() => new PaymentScreenVM(rootStore), [rootStore]);
  return <ctx.Provider value={store}>{children}</ctx.Provider>;
};

export const usePaymentScreenVM = () => useVM(ctx);

class PaymentScreenVM {
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

  get cashback() {
    const balances = this.rootStore.balanceStore.balances;
    return BN.formatUnits(balances.TICKET?.balance ?? 0).toNumber();
  }

  get ethBalance() {
    return this.rootStore.balanceStore.balances.ETH?.balance ?? 0;
  }
}
