import styled from "@emotion/styled";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import HomeIcon from "./assets/icons/home.svg";
import InfoIcon from "./assets/icons/info.svg";
import TargetIcon from "./assets/icons/target.svg";
import BottomNav from "./components/BottomNav";
import About from "./pages/About";
import MainScreen from "./pages/MainScreen";
import Trades from "./pages/Trades";
import Strategy from "./pages/PaymentScreen";
import Strategies from "./pages/Strategies";

export const screens = [
  {
    path: "/main",
    label: "Main",
    icon: <img src={HomeIcon} alt="Home" />,
  },
  {
    path: "/strategies",
    label: "Strategies",
    icon: <img src={TargetIcon} alt="Target" />,
    default: true,
  },
  {
    path: "/about",
    label: "About",
    icon: <img src={InfoIcon} alt="Info" />,
  },
];

export default function App() {
  const { pathname } = useLocation();
  const defaultScreen = screens.find((screen) => screen.default);
  let active =
    screens.find((p) => pathname.startsWith(p.path))?.label ||
    defaultScreen?.label;
  return (
    <Wrapper>
      <Routes>
        <Route path="/main" element={<MainScreen />} />
        <Route path="/strategies" element={<Strategies />} />
        <Route path="/about" element={<About />} />
        <Route path="/trades" element={<Trades />} />
        <Route path="/payment" element={<Strategy />} />
        <Route path="*" element={<Navigate to="/strategies" replace />} />
      </Routes>
      <BottomNav active={active} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;
