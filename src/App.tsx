import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import styled from "@emotion/styled";
import BottomNav from "./components/BottomNav";

const Wrapper = styled.div`
  max-width: 420px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #181818;
`;

const Content = styled.div`
  flex: 1 1 auto;
  padding-bottom: 96px; /* чтобы не перекрывалось меню */
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
  max-width: 420px;
  padding: 0 16px 32px 16px;
  box-sizing: border-box;
  pointer-events: all;
`;

const pages = [
  { path: "/main", label: "Main", element: <div>Main page</div> },
  { path: "/trades", label: "Trades", element: <div>Trades page</div> },
  {
    path: "/strategies",
    label: "Strategies",
    element: <div>Strategies page</div>,
  },
  { path: "/about", label: "About", element: <div>About page</div> },
  { path: "/refferal", label: "Refferal", element: <div>Refferal page</div> },
];

function AppRoutes() {
  const location = useLocation();
  // Определяем активный таб по location.pathname
  let active =
    pages.find((p) => location.pathname.startsWith(p.path))?.label || "Trades";
  return (
    <Wrapper>
      <Content>
        <Routes>
          <Route path="/" element={<Navigate to="/trades" replace />} />
          {pages.map((p) => (
            <Route key={p.path} path={p.path} element={p.element} />
          ))}
          <Route path="*" element={<Navigate to="/trades" replace />} />
        </Routes>
      </Content>
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
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
