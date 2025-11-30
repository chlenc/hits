import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { WagmiProvider } from "wagmi";
import wagmiConfig from "./configs/wagmiConfig";
import RootStore from "./stores/RootStore";
import { storesContext } from "./stores/useStores";
import { loadState } from "./utils/localStorage";

import App from "./App";
import WalletAuth from "./components/WalletAuth";
import "./index.css";

const queryClient = new QueryClient();

const initialState = loadState();
const mobxStore = new RootStore(initialState);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <storesContext.Provider value={mobxStore}>
            <WalletAuth />
            {/* <SyncDataFromHook /> */}
            {/* 👆 this component is responsible for syncing 
              account data from wagmi hooks to mobx store */}
            <App />
            <ToastContainer />
          </storesContext.Provider>
        </QueryClientProvider>
      </WagmiProvider>
    </HashRouter>
  </StrictMode>
);
