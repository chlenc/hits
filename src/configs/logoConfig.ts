import { COINS, NETWORKS } from "./networkConfig";
import usdtLogo from "../assets/coin-icons/usdt.png";
import usdcLogo from "../assets/coin-icons/usdc.png";
import daiLogo from "../assets/coin-icons/dai.png";
import usdLogo from "../assets/coin-icons/usd.png";

import ethereumLogo from "../assets/network-icons/ethereum.svg";
import tronLogo from "../assets/network-icons/tron.svg";
import tonLogo from "../assets/network-icons/ton.svg";
import solanaLogo from "../assets/network-icons/solana.svg";
import baseLogo from "../assets/network-icons/base.svg";
import cardLogo from "../assets/network-icons/card.svg";

export const COIN_ICONS: Record<string, string> = {
  [COINS.ETH]: ethereumLogo,
  [COINS.USDT]: usdtLogo,
  [COINS.USDC]: usdcLogo,
  [COINS.DAI]: daiLogo,
  [COINS.TRX]: tronLogo,
  [COINS.TON]: tonLogo,
  [COINS.SOL]: solanaLogo,
  [COINS.USD]: usdLogo,
};

export const NETWORK_ICONS: Record<string, string> = {
  [NETWORKS.BASE]: baseLogo,
  [NETWORKS.SOLANA]: solanaLogo,
  [NETWORKS.TRON]: tronLogo,
  [NETWORKS.TON]: tonLogo,
  [NETWORKS.CARD]: cardLogo,
};
