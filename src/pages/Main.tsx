import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Column, Row } from "../components/Flex";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import styled from "@emotion/styled";
import SizedBox from "../components/SizedBox";
import Button from "../components/Button";
import starsIcon from "../assets/icons/stars.svg";

const StyledPageContainer = styled(PageContainer)`
  gap: 32px;
`;

const BlockTitle = styled.div`
  color: #fff;
  font-family: "Instrument Sans";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
`;

const SecondaryTitle = styled.div<{ color?: string }>`
  color: ${({ color }) => color || "#fff"};
  font-family: "Instrument Serif";
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
`;

const Main: React.FC = () => {
  return (
    <StyledPageContainer>
      <Column gap={16}>
        <PageTitle>Main</PageTitle>
        <Row justifyContent="start">
          <ConnectButton />
        </Row>
      </Column>
      <Column crossAxisSize="max">
        <BlockTitle>Claimable Balance</BlockTitle>
        <Row alignItems="flex-end">
          <PageTitle>5,512856 ETH</PageTitle> <SizedBox width={8} />
          <SecondaryTitle>$29 521</SecondaryTitle>
        </Row>
        <SizedBox height={16} />
        <Button>
          Claim &nbsp; <img src={starsIcon} alt="stars" />
        </Button>
      </Column>
      {/* <Column crossAxisSize="max">
        <BlockTitle>Cashback</BlockTitle>
        <Row alignItems="flex-end">
          <PageTitle>0,06129 ETH</PageTitle>
        </Row>
        <SizedBox height={16} />
        <Button>
          Claim &nbsp; <img src={starsIcon} alt="stars" />
        </Button>
      </Column> */}
      <Column crossAxisSize="max">
        <BlockTitle>Total PnL</BlockTitle>
        <Row alignItems="flex-end">
          <PageTitle>0,69382 ETH</PageTitle>
          <SizedBox width={8} />
          <SecondaryTitle color="#19F096">+$1 456,25</SecondaryTitle>
        </Row>
        <SizedBox height={16} />
        <BlockTitle>Trades</BlockTitle>
        <Row alignItems="flex-end">
          <PageTitle>160</PageTitle>
          <SizedBox width={8} />
          <Row>
            <SecondaryTitle color="#19F096">150 wins</SecondaryTitle>&nbsp;
            <SecondaryTitle>/</SecondaryTitle>&nbsp;
            <SecondaryTitle color="#ED5959">10 losses</SecondaryTitle>
          </Row>
        </Row>
        <SizedBox height={16} />
        <Button secondary>Trades History +</Button>
      </Column>
    </StyledPageContainer>
  );
};

export default Main;
