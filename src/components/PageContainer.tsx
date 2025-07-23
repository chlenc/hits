import styled from "@emotion/styled";
import { Row } from "./Flex";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import logoIcon from "../assets/icons/logo.svg";

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

const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <PageContainerRoot>
      <Row justifyContent="space-between" alignItems="center">
        <img src={logoIcon} alt="logo" height={32} />
        <ConnectButton
          showBalance={true}
          accountStatus="avatar"
          chainStatus="icon"
        />
      </Row>
      {children}
    </PageContainerRoot>
  );
};

export default PageContainer;
