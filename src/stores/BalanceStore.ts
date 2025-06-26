import { HermesClient } from "@pythnetwork/hermes-client";
import { makeAutoObservable, reaction, runInAction } from "mobx";
import { createPublicClient, http } from "viem";
import { Coins, TICKET_PRICE } from "../configs/networkConfig";
import BN from "../utils/BN";
import RootStore from "./RootStore";
import { presaleAbi } from "../configs/presaleAbi";
type TBalance = {
  symbol: string;
  decimals: number;
  address?: `0x${string}`;
  isNative?: boolean;
  balance: number;
};
class BalanceStore {
  public readonly rootStore: RootStore;
  balances: Record<string, TBalance> = {};
  prices: Record<string, number> = {};

  constructor(rootStore: RootStore, initState?: any) {
    this.rootStore = rootStore;
    makeAutoObservable(this);

    reaction(
      () => [rootStore.accountStore.address],
      () => this.updateTokenBalances(),
      { fireImmediately: true }
    );

    setTimeout(() => this.updateTokenBalances(), 1000);
    setInterval(() => this.updateTokenBalances(), 30000);

    setTimeout(this.updateTokenPriceUSD, 1000);
    setInterval(this.updateTokenPriceUSD, 30000);
  }

  //todo update erc20 balances
  updateTokenBalances = async () => {
    const { networkConfig, address } = this.rootStore.accountStore;
    if (!networkConfig || !address) return;
    const { chainId, tokens: tokensFromConfig, rpc, contract } = networkConfig;
    const nativeTokens = tokensFromConfig.filter((token) => token.isNative);

    const client = createPublicClient({
      chain: {
        id: chainId,
        name: networkConfig.name,
        nativeCurrency: { name: "Ether", symbol: Coins.ETH, decimals: 18 },
        rpcUrls: { default: { http: [rpc] } },
      },
      transport: http(),
    });
    const balances: Record<string, TBalance> = {};

    let nativeBalance: bigint = BigInt(0);

    try {
      nativeBalance = await client.getBalance({ address });
      nativeTokens.forEach((token) => {
        balances[token.symbol] = {
          balance: BN.formatUnits(nativeBalance, token.decimals).toNumber(),
          decimals: token.decimals,
          address: token.address,
          isNative: token.isNative,
          symbol: token.symbol,
        };
      });
    } catch (error) {
      console.error("Error fetching native balance:", error);
    }

    try {
      const ticketBalance = await client.readContract({
        address: contract as `0x${string}`,
        abi: presaleAbi,
        functionName: "getEthSentBy",
        args: [address as `0x${string}`],
      });

      runInAction(() => {
        balances.TICKET = {
          balance: Number(ticketBalance),
          decimals: 0,
          symbol: "TICKET",
          isNative: false,
        };
      });
    } catch (error) {
      console.error("Error fetching ticket balance:", error);
    }
    runInAction(() => (this.balances = balances));
  };

  updateTokenPriceUSD = async () => {
    const connection = new HermesClient("https://hermes.pyth.network", {});
    const { networkConfig } = this.rootStore.accountStore;
    if (!networkConfig) return;
    const tokens = networkConfig.tokens.filter((token) => token.priceFeed);

    const priceIds = tokens.map(({ priceFeed }) => priceFeed);
    const prices = await connection.getLatestPriceUpdates(
      priceIds as string[],
      { parsed: true }
    );

    const tokenPrices: Record<string, number> = {};

    tokens.forEach((token, index) => {
      if (token.symbol && prices.parsed && prices.parsed[index]) {
        const { price: priceData } = prices.parsed[index];
        if (priceData && priceData.price && priceData.expo !== undefined) {
          const realPrice = BN.formatUnits(
            priceData.price,
            -1 * priceData.expo
          ).toNumber();
          tokenPrices[token.symbol] = realPrice;
        }
      }
    });

    runInAction(() => (this.prices = tokenPrices));
  };
}

export default BalanceStore;
