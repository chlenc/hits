import { autorun, makeAutoObservable } from "mobx";
import AccountStore from "./AccountStore";
import BalanceStore from "./BalanceStore";
import ReferralStore from "./ReferralStore";
import { saveState } from "../utils/localStorage";

export interface ISerializedRootStore {}

export default class RootStore {
  accountStore: AccountStore;
  balanceStore: BalanceStore;
  referralStore: ReferralStore;

  constructor(_initialState?: ISerializedRootStore) {
    this.accountStore = new AccountStore(this);
    this.balanceStore = new BalanceStore(this);
    this.referralStore = new ReferralStore(this);
    makeAutoObservable(this);

    autorun(
      () => {
        saveState(this.serialize());
      },
      { delay: 1000 }
    );
  }

  serialize = (): ISerializedRootStore => ({});
}
