import { createAppKit } from "@reown/appkit/react";

import { mainnet, polygon, bsc, arbitrum, base } from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

// 1. Get projectId from https://dashboard.reown.com
//todo env
const projectId = "5b6044dbe740d0ba1720d2fb54d497d1"; //79696fd6ff2f660aaa3a3ed92e36472f
// 2. Create a metadata object - optional
const metadata = {
  name: "Hits4Fun",
  description: "Hits 4 Fun – first volatility 0DTE trading platform",
  url: "https://app.hits4.fun", // origin must match your domain & subdomain
  icons: [
    "https://static.tildacdn.com/tild3037-3638-4237-a261-623936633033/web-app-manifest-192.png",
  ],
};

// 3. Set the networks
const networks = [mainnet, polygon, bsc, arbitrum, base] as any;

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    // Email and social features are managed via dashboard.reown.com
  },
  allWallets: "SHOW", // Показываем все кошельки
  themeMode: "dark",
});

export default wagmiAdapter.wagmiConfig;
