import { autorun, makeAutoObservable } from "mobx";
import AccountStore, { type IAccountStoreInitState } from "./AccountStore";
import BalanceStore from "./BalanceStore";
import { saveState } from "../utils/localStorage";
import StrategiesStore from "./StrategiesStore";
import InvoiceStore, { type ISerializedInvoiceStore } from "./InvoiceStore";

export interface ISerializedRootStore {
  accountStore?: IAccountStoreInitState;
  invoiceStore?: ISerializedInvoiceStore;
}

export default class RootStore {
  accountStore: AccountStore;
  balanceStore: BalanceStore;
  strategiesStore: StrategiesStore;
  invoiceStore: InvoiceStore;

  constructor(initialState?: ISerializedRootStore) {
    this.accountStore = new AccountStore(this, initialState?.accountStore);
    this.balanceStore = new BalanceStore(this);
    this.strategiesStore = new StrategiesStore(this);
    this.invoiceStore = new InvoiceStore(this);

    makeAutoObservable(this);

    autorun(
      () => {
        saveState(this.serialize());
      },
      { delay: 1000 }
    );
  }

  serialize = (): ISerializedRootStore => ({
    accountStore: this.accountStore.serialize(),
    invoiceStore: this.invoiceStore.serialize(),
  });
}
