import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Column, Row } from "../components/Flex";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import styled from "@emotion/styled";
import SizedBox from "../components/SizedBox";
import Button from "../components/Button";
import starsIcon from "../assets/icons/stars.svg";
import achievementsImage from "../assets/images/achievements.png";
import { useWalletConnectRedirect } from "../hooks/useWalletConnectRedirect";
import { observer } from "mobx-react-lite";
import { useStores } from "../stores/useStores";
import BN from "../utils/BN";
import Section from "../components/Section";
import PnLChart from "../components/PnLChart";

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

const Main: React.FC = observer(() => {
  const { accountStore, balanceStore } = useStores();
  useWalletConnectRedirect({
    redirectPath: "/strategies",
    autoOpenModal: true,
  });

  const stats = accountStore.tradingStats;
  const claimableBalance = BN.formatUnits(stats?.claimableBalance ?? "0", 18);
  const claimableBalanceUSD = claimableBalance.times(
    balanceStore.prices.ETH ?? 0
  );
  const totalPnL = new BN(stats?.totalPnL ?? "0");
  const totalPnLUSD = totalPnL.times(balanceStore.prices.ETH ?? 0);
  const totalTradesAmount = stats?.totalTradesAmount ?? 0;
  const winTradesAmount = stats?.winTradesAmount ?? 0;
  const loseTradesAmount = stats?.loseTradesAmount ?? 0;
  const pnlChart = stats?.pnl_30d_chart ?? [];

  return (
    <StyledPageContainer>
      <Row justifyContent="space-between" alignItems="center">
        <PageTitle>Main</PageTitle>
        <ConnectButton />
      </Row>
      <Column crossAxisSize="max">
        <BlockTitle>Claimable Balance</BlockTitle>
        <Row alignItems="flex-end">
          <PageTitle>
            {claimableBalance.toSignificant(4).toFormat()} ETH
          </PageTitle>{" "}
          <SizedBox width={8} />
          <SecondaryTitle>
            ${claimableBalanceUSD.toSignificant(2).toFormat()}
          </SecondaryTitle>
        </Row>
        {claimableBalance.gt(0) && (
          <Button style={{ marginTop: 16 }}>
            Claim &nbsp; <img src={starsIcon} alt="stars" />
          </Button>
        )}
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
      <img
        src={achievementsImage}
        alt="achievements"
        style={{ width: "100%" }}
      />
      <Column crossAxisSize="max">
        <BlockTitle>Total PnL</BlockTitle>
        <Row alignItems="flex-end">
          <PageTitle>{totalPnL.toSignificant(4).toFormat()} ETH</PageTitle>
          <SizedBox width={8} />
          <SecondaryTitle color={totalPnL.gt(0) ? "#19F096" : "#ED5959"}>
            {totalPnLUSD.gt(0) ? "" : "-"}$
            {totalPnLUSD.abs().toSignificant(2).toFormat()}
          </SecondaryTitle>
        </Row>
        <SizedBox height={16} />
        <BlockTitle>Trades</BlockTitle>
        <Row alignItems="flex-end">
          <PageTitle>{totalTradesAmount}</PageTitle>
          <SizedBox width={8} />
          <Row>
            <SecondaryTitle color="#19F096">
              {winTradesAmount} wins
            </SecondaryTitle>
            &nbsp;
            <SecondaryTitle>/</SecondaryTitle>&nbsp;
            <SecondaryTitle color="#ED5959">
              {loseTradesAmount} losses
            </SecondaryTitle>
          </Row>
        </Row>
        {pnlChart.length > 0 && (
          <Section style={{ marginTop: 16 }}>
            <PnLChart data={pnlChart} />
            <Row justifyContent="center">
              <BlockTitle>Last 30 days PnL </BlockTitle>
            </Row>
          </Section>
        )}
        <SizedBox height={16} />
        <Button secondary>Trades History +</Button>
      </Column>
      {/* <PageTitle>Strategy of the Day</PageTitle> */}
      {/* <SizedBox height={32} /> */}
    </StyledPageContainer>
  );
});

export default Main;
