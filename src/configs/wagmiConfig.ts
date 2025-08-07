import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "hits4fun",
  projectId: "5b6044dbe740d0ba1720d2fb54d497d1", //79696fd6ff2f660aaa3a3ed92e36472f

  chains: [base /* sepolia */],
  ssr: true,
});
