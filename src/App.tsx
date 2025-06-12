import {
  HashRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import styled from "@emotion/styled";
import BottomNav from "./components/BottomNav";
import Trades from "./pages/Trades";
import Strategies from "./pages/Strategies";
import About from "./pages/About";
import Refferal from "./pages/Referrals";
import Main from "./pages/Main";

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
  { path: "/main", label: "Main", },
  { path: "/trades", label: "Trades"},
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
    pages.find((p) => location.pathname.startsWith(p.path))?.label || "Trades";
  return (
    <Wrapper>
      <Routes>
        <Route path="/" element={<Navigate to="/trades" replace />} />
        <Route path="/main" element={<Main />} />
        <Route path="/trades" element={<Trades />} />
        <Route path="/strategies" element={<Strategies />} />
        <Route path="/about" element={<About />} />
        <Route path="/refferal" element={<Refferal />} />
        <Route path="*" element={<Navigate to="/trades" replace />} />
      </Routes>
      <BottomNavWrapper>
        <BottomNavInner>
          <BottomNav active={active} />
        </BottomNavInner>
      </BottomNavWrapper>
    </Wrapper>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}
