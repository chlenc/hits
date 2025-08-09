import React from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { screens } from "../App";
import DemoTrading from "./DemoTrading";
import { Row } from "./Flex";

const activeColor = "#D67EF7";
const inactiveColor = "#797A87";
const bgColor = "#1A1A1A";

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
  padding: 0 16px 16px 16px;
  box-sizing: border-box;
  pointer-events: all;
`;

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

export const BottomNav: React.FC<{ active?: string }> = ({ active }) => {
  const navigate = useNavigate();

  return (
    <BottomNavWrapper>
      <BottomNavInner>
        <Nav>
          {screens.map((tab) => {
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
        <Row alignItems="center" justifyContent="center">
          <DemoTrading style={{ paddingTop: 8, marginBottom: -8 }} />
        </Row>
      </BottomNavInner>
    </BottomNavWrapper>
  );
};

export default BottomNav;
