import styled from "@emotion/styled";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import {
  useAccount,
  useChainId,
  useConfig,
  useWalletClient,
  WagmiProvider,
} from "wagmi";
import { wagmiConfig } from "./configs/wagmiConfig";
import RootStore from "./stores/RootStore";
import { storesContext, useStores } from "./stores/useStores";
import { loadState } from "./utils/localStorage";
import BottomNav from "./components/BottomNav";
import Refferal from "./pages/Referrals";
import Main from "./pages/Main";
import Trades from "./pages/Trades";
import Strategies from "./pages/Strategies";
import About from "./pages/About";
import Invest from "./pages/Invest";
import Strategy from "./pages/PaymentScreen";
import { ToastContainer } from "react-toastify";

const Wrapper = styled.div`
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

const BottomNavWrapper = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  pointer-events: none;
  z-index: 100;
`;

const BottomNavInner = styled.div`
  width: 100%;
  padding: 0 16px 32px 16px;
  box-sizing: border-box;
  pointer-events: all;
`;

export const pages = [
  { path: "/main", label: "Main" },
  { path: "/trades", label: "Trades" },
  {
    path: "/strategies",
    label: "Strategies",
  },
  { path: "/about", label: "About" },
  { path: "/refferal", label: "Refferal" },
];

function AppRoutes() {
  const location = useLocation();
  // Определяем активный таб по location.pathname
  let active =
    pages.find((p) => location.pathname.startsWith(p.path))?.label ||
    "Strategies";
  return (
    <Wrapper>
      <Routes>
        {/* <Route path="/" element={<Presale />} /> */}
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}

        {/* <Route path="/" element={<Navigate to="/trades" replace />} /> */}
        <Route path="/main" element={<Main />} />
        <Route path="/trades" element={<Trades />} />
        <Route path="/strategies" element={<Strategies />} />
        <Route path="/about" element={<About />} />
        <Route path="/refferal" element={<Refferal />} />
        <Route path="/invest" element={<Invest />} />
        <Route path="/strategy/:id" element={<Strategy />} />
        <Route path="*" element={<Navigate to="/strategies" replace />} />
      </Routes>
      <BottomNavWrapper>
        <BottomNavInner>
          <BottomNav active={active} />
        </BottomNavInner>
      </BottomNavWrapper>
    </Wrapper>
  );
}
const queryClient = new QueryClient();

const initialState = loadState();
const mobxStore = new RootStore(initialState);

export default function App() {
  return (
    <HashRouter>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            locale="en"
            modalSize="compact"
            theme={darkTheme({
              accentColor:
                "linear-gradient(114deg, #E478FE 17.57%, #9A45FE 81.44%)",
              accentColorForeground: "white",
              borderRadius: "large",
              fontStack: "system",
            })}
            initialChain={wagmiConfig.chains[0]}
          >
            <storesContext.Provider value={mobxStore}>
              <_WalletAuth />
              <AppRoutes />
              <ToastContainer />
            </storesContext.Provider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </HashRouter>
  );
}

const _WalletAuth: React.FC = observer(() => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const config = useConfig();
  const { data: walletClient } = useWalletClient();

  const { accountStore } = useStores();

  useEffect(() => {
    accountStore.setAddress(address);
    accountStore.setIsConnected(isConnected);
    accountStore.setChainId(chainId);
    accountStore.setWagmiConfig(config);
  }, [address, isConnected, chainId, config]);

  useEffect(() => {
    console.log("WalletAuth: checking auth conditions", {
      isConnected: accountStore.isConnected,
      address: accountStore.address,
      hasWalletClient: !!walletClient,
      isAuthenticating: accountStore.isAuthenticating,
    });

    if (
      accountStore.isConnected &&
      accountStore.address &&
      walletClient &&
      !accountStore.isAuthenticating
    ) {
      console.log("WalletAuth: triggering authentication");
      accountStore.triggerAuthentication(walletClient);
    }
  }, [
    accountStore.isConnected,
    accountStore.address,
    walletClient,
    accountStore.isAuthenticating,
  ]);

  return null; // Этот компонент не рендерит ничего
});
