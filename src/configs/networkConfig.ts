export const NETWORKS = {
  BASE: "base",
  // SEPOLIA: "sepolia",
  // ETHEREUM = "ethereum",
  // POLYGON = "polygon",
  // BSC = "bsc",
  // ARBITRUM = "arbitrum",
};

export const TICKET_PRICE = 0.005;

export const COINS = {
  ETH: "ETH",
  USDT: "USDT",
  USDC: "USDC",
  DAI: "DAI",
} as const;

type TokenConfig = {
  symbol: string;
  decimals: number;
  address?: `0x${string}`;
  isNative?: boolean;
  priceFeed?: string;
};

type NetworkConfig = {
  name: string;
  chainId: number;
  contract: `0x${string}`;
  rpc: string;
  testnet?: boolean;
  tokens: TokenConfig[];
  explorer: string;
};


//price feeds https://www.pyth.network/developers/price-feed-ids
export const NetworkConfig: Record<string, NetworkConfig> = {
  // sepolia: {
  //   name: NETWORKS.SEPOLIA,
  //   chainId: 11155111,
  //   contract: "0x35dC6f1415CBF0221F6babf19e2844A86cF5cDc0",
  //   rpc: "https://ethereum-sepolia.publicnode.com",
  //   explorer: "https://sepolia.etherscan.io",
  //   tokens: [
  //     {
  //       symbol: COINS.ETH,
  //       decimals: 18,
  //       isNative: true,
  //       priceFeed:
  //         "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
  //     },
  //     {
  //       symbol: COINS.USDT,
  //       decimals: 6,
  //       address: "0x622fd0b24B14Fb76d27d8616a96ECbd05fC27527",
  //       priceFeed:
  //         "0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b",
  //     },
  //     {
  //       symbol: COINS.USDC,
  //       decimals: 6,
  //       address: "0xd6F4D4e0550622C8165106F81aaCeB0084ac78Ad",
  //       priceFeed:
  //         "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
  //     },
  //   ],
  // },
  base: {
    name: NETWORKS.BASE,
    chainId: 8453,
    contract: "0xd7d889Abe43D7C59cD33eD1d2bAa2EDe0b718762",
    rpc: "https://mainnet.base.org",
    explorer: "https://basescan.org",
    tokens: [
      {
        symbol: COINS.USDT,
        decimals: 6,
        address: "0xA614E4c8E06a7F0719B6d95aBdcF9D4b46b16bcF",
        priceFeed:
          "0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b",
      },
      {
        symbol: COINS.USDC,
        decimals: 6,
        address: "0xD9b312D77Bc7B2e29Ff8beE60a77A5f9E69E6cDC",
        priceFeed:
          "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
      },
      {
        symbol: COINS.ETH,
        decimals: 18,
        isNative: true,
        priceFeed:
          "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
      },
    ],
  },
  // ethereum: {
  //   name: NETWORKS.ETHEREUM,
  //   chainId: 1,
  //   contract: "",
  //   rpc: "https://ethereum.publicnode.com",
  //   explorer: "https://etherscan.io",
  //   tokens: [
  //         {
  //             "symbol": Coins.ETH,
  //             "decimals": 18,
  //             "isNative": true,
  //             "priceFeed":'0x0a662c63fcc743872a986d93784913c8ddb82172b9fccfb7239d413abcfd4feb'
  //         },
  //         {
  //             "symbol": Coins.USDT,
  //             "decimals": 6,
  //             "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  //             "priceFeed": "0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b"
  //         },
  //         {
  //             "symbol": Coins.USDC,
  //             "decimals": 6,
  //             "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  //             "priceFeed": "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a"
  //         }
  //     ]
  // },
  // polygon: {
  //   name: NETWORKS.POLYGON,
  //   chainId: 137,
  //   contract: "",
  //   rpc: "https://polygon-rpc.com",
  //   explorer: "https://polygonscan.com",
  //   tokens: [
  //     {
  //         "symbol": Coins.USDT,
  //         "decimals": 6,
  //         "address": "0x3813e82e6f7098b9583FC0F33a962D02018B6803",
  //         "priceFeed": "0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b"
  //     },
  //     {
  //         "symbol": Coins.USDC,
  //         "decimals": 6,
  //         "address": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  //         "priceFeed": "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a"
  //     }
  // ]
  // },
  // bsc: {
  //   name: NETWORKS.BSC,
  //   chainId: 56,
  //   contract: "",
  //   rpc: "https://bsc-dataseed.binance.org/",
  //   explorer: "https://bscscan.com",
  //   tokens: [
  //     {
  //         "symbol": Coins.USDT,
  //         "decimals": 6,
  //         "address": "0x55d398326f99059fF775485246999027B3197955",
  //         "priceFeed": "0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b"
  //     },
  //     {
  //         "symbol": Coins.USDC,
  //         "decimals": 6,
  //         "address": "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
  //         "priceFeed": "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a"
  //     }
  // ]
  // },
  // arbitrum: {
  //   name: NETWORKS.ARBITRUM,
  //   chainId: 42161,
  //   contract: "",
  //   rpc: "https://arb1.arbitrum.io/rpc",
  //   explorer: "https://arbiscan.io",
  //   tokens: [
  //     {
  //         "symbol": Coins.USDT,
  //         "decimals": 6,
  //         "address": "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
  //         "priceFeed": "0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b"
  //     },
  //     {
  //         "symbol": Coins.USDC,
  //         "decimals": 6,
  //         "address": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  //         "priceFeed": "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a"
  //     }
  // ]
  // },
};
