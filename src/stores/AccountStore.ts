import { makeAutoObservable } from "mobx";
import type { Config } from "wagmi";
import { NetworkConfig } from "../configs/networkConfig";
import RootStore from "./RootStore";

//store abt user wallet and network
class AccountStore {
  public readonly rootStore: RootStore;
  address?: `0x${string}`;
  isConnected: boolean = false;
  isProcessing: boolean = false;
  chainId: number | null = null;
  wagmiConfig: Config | null = null;

  constructor(rootStore: RootStore, initState?: any) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
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

  // Заглушка для метода отправки транзакции
  // В предыдущей версии этот метод использовался для:
  // 1. Подготовки транзакции для покупки токенов
  // 2. Отправки транзакции через Web3 провайдер
  // 3. Ожидания подтверждения транзакции
  // 4. Обработки результата (успех/ошибка)
  //
  // Примерная структура предыдущей реализации:
  // async sendTransactionAsync(params: {
  //   to: string;           // адрес контракта
  //   value: string;        // количество токенов/эфира для отправки
  //   data?: string;        // данные для смарт-контракта (если есть)
  // }) {
  //   const provider = await this.getProvider();
  //   const signer = provider.getSigner();
  //   const tx = await signer.sendTransaction(params);
  //   const receipt = await tx.wait();
  //   return receipt;
  // }
}

export default AccountStore;
