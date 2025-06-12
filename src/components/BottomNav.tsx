import React from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import HomeIcon from "../assets/icons/home.svg";
import WalletIcon from "../assets/icons/wallet.svg";
import TargetIcon from "../assets/icons/target.svg";
import InfoIcon from "../assets/icons/info.svg";
import LinkIcon from "../assets/icons/link.svg";

const tabs = [
  { label: "Main", icon: <img src={HomeIcon} alt="Home" />, path: "/main" },
  {
    label: "Trades",
    icon: <img src={WalletIcon} alt="Wallet" />,
    path: "/trades",
  },
  {
    label: "Strategies",
    icon: <img src={TargetIcon} alt="Target" />,
    path: "/strategies",
  },
  { label: "About", icon: <img src={InfoIcon} alt="Info" />, path: "/about" },
  {
    label: "Refferal",
    icon: <img src={LinkIcon} alt="Link" />,
    path: "/refferal",
  },
];

const activeColor = "#D67EF7";
const inactiveColor = "#797A87";
const bgColor = "#1A1A1A";

const Nav = styled.nav`
  display: flex;
  border-radius: 24px;
  background: ${bgColor};
  margin: 0 auto;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  max-width: 420px;
`;

const Tab = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex: 1 0 0;
  color: ${({ active }) => (active ? activeColor : inactiveColor)};
  font-family: "Instrument Sans", sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 150%;
  letter-spacing: -0.24px;
  cursor: pointer;
  padding: 12px;
  box-sizing: border-box;

  img {
    width: 24px;
    height: 24px;
    display: block;
    margin-bottom: 4px;
    filter: ${({ active }) =>
      active
        ? "invert(48%) sepia(79%) saturate(2476%) hue-rotate(235deg) brightness(118%) contrast(119%)"
        : "invert(45%) sepia(8%) saturate(1094%) hue-rotate(202deg) brightness(94%) contrast(86%)"};
  }
`;

export const BottomNav: React.FC<{ active?: string }> = ({
  active = "Trades",
}) => {
  const navigate = useNavigate();

  return (
    <Nav>
      {tabs.map((tab) => {
        const isActive = tab.label === active;
        return (
          <Tab
            key={tab.label}
            active={isActive}
            onClick={() => navigate(tab.path)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </Tab>
        );
      })}
    </Nav>
  );
};

export default BottomNav;
