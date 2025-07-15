import { makeAutoObservable, runInAction } from "mobx";
import { apiService, type Strategy } from "../services/api";
import RootStore from "./RootStore";

class StrategiesStore {
  public readonly rootStore: RootStore;
  strategies: Strategy[] = [];
  _initialized = false;

  constructor(rootStore: RootStore, _initState?: any) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
    this.fetchStrategies();
  }

  async fetchStrategies() {
    const response = await apiService.getStrategies();
    runInAction(() => {
      this.strategies = response.strategies;
      this._initialized = true;
    });
  }

  get initialized() {
    return this.rootStore.balanceStore.initialized && this._initialized;
  }

  getStrategyById(id: string) {
    return this.strategies.find((strategy) => strategy.id === id);
  }
}

export default StrategiesStore;
