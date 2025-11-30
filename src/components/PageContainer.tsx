import styled from "@emotion/styled";
import React from "react";
import logoIcon from "../assets/icons/logo.svg";
import { Row } from "./Flex";
import WalletConnectButton from "./WalletConnectButton";

const PageContainerRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  min-height: 100vh;
  width: 100%;
  max-width: 480px;

  padding: 24px 16px 120px 16px;
  box-sizing: border-box;
`;

const ContentWrapper = styled.div`
  box-sizing: border-box;
  gap: 16px;
  display: flex;
  flex-direction: column;
`;

const PageContainer = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => {
  return (
    <PageContainerRoot>
      <Row justifyContent="space-between" alignItems="center">
        <a href="https://hits4.fun" target="_blank" rel="noopener noreferrer">
          <img src={logoIcon} alt="logo" height={32} />
        </a>
        <WalletConnectButton />
      </Row>
      <ContentWrapper style={style}>{children}</ContentWrapper>
    </PageContainerRoot>
  );
};

export default PageContainer;
