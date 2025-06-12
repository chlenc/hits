import React from "react";
import styled from "@emotion/styled";
import HomeIcon from "../assets/icons/home.svg";
import WalletIcon from "../assets/icons/wallet.svg";
import TargetIcon from "../assets/icons/target.svg";
import InfoIcon from "../assets/icons/info.svg";
import LinkIcon from "../assets/icons/link.svg";

const tabs = [
  { label: "Main", icon: <HomeIcon /> },
  { label: "Trades", icon: <WalletIcon /> },
  { label: "Strategies", icon: <TargetIcon /> },
  { label: "About", icon: <InfoIcon /> },
  { label: "Refferal", icon: <LinkIcon /> },
];

const activeColor = "#D67EF7";
const inactiveColor = "#797A87";
const bgColor = "#1A1A1A";

const Nav = styled.nav`
  display: flex;
  width: 343px;
  border-radius: 24px;
  background: ${bgColor};
  padding: 24px 16px 34px 16px;
  margin: 0 auto;
  justify-content: space-between;
  align-items: center;
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
  svg {
    width: 24px;
    height: 24px;
    display: block;
    margin-bottom: 4px;
  }
`;

export const BottomNav: React.FC<{ active?: string }> = ({
  active = "Trades",
}) => (
  <Nav>
    {tabs.map((tab) => {
      const isActive = tab.label === active;
      return (
        <Tab key={tab.label} active={isActive}>
          {tab.icon}
          <span>{tab.label}</span>
        </Tab>
      );
    })}
  </Nav>
);

export default BottomNav;
