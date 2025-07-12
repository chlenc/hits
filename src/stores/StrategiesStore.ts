import { makeAutoObservable } from "mobx";
import { apiService, type Strategy } from "../services/api";
import RootStore from "./RootStore";

class StrategiesStore {
  public readonly rootStore: RootStore;
  strategies: Strategy[] = [];

  constructor(rootStore: RootStore, _initState?: any) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
    this.fetchStrategies();
  }

  async fetchStrategies() {
    const response = await apiService.getStrategies();
    this.strategies = response.strategies;
  }
}

export default StrategiesStore;
