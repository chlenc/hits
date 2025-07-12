import { autorun, makeAutoObservable } from "mobx";
import AccountStore, { type IAccountStoreInitState } from "./AccountStore";
import BalanceStore from "./BalanceStore";
import { saveState } from "../utils/localStorage";

export interface ISerializedRootStore {
  accountStore?: IAccountStoreInitState;
}

export default class RootStore {
  accountStore: AccountStore;
  balanceStore: BalanceStore;

  constructor(initialState?: ISerializedRootStore) {
    this.accountStore = new AccountStore(this, initialState?.accountStore);
    this.balanceStore = new BalanceStore(this);
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
  });
}
