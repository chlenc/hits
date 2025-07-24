import styled from "@emotion/styled";
import { observer } from "mobx-react-lite";
import starsIcon from "../../assets/icons/stars.svg";
import Button from "../../components/Button";
import { Column, Row } from "../../components/Flex";
import PageContainer from "../../components/PageContainer";
import PageTitle from "../../components/PageTitle";
import SizedBox from "../../components/SizedBox";
import { useWalletConnectRedirect } from "../../hooks/useWalletConnectRedirect";
import { useStores } from "../../stores/useStores";
import BN from "../../utils/BN";
import Referrals from "./Referrals";
import TradesHistory from "./TradesHistory";

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

const MainScreen: React.FC = observer(() => {
  const { balanceStore, accountStore } = useStores();
  useWalletConnectRedirect({
    redirectPath: "/strategies",
    autoOpenModal: true,
  });
  // const navigate = useNavigate();
  const stats = accountStore.tradingStats;
  // const pnlChart = accountStore.tradingStats?.pnl_30d_chart;

  //todo
  const claimableBalance = new BN(0);
  // const claimableBalance = BN.formatUnits(stats?.claimableBalance ?? "0", 18);
  const claimableBalanceUSD = claimableBalance.times(
    balanceStore.prices.ETH ?? 0
  );

  // const deposited = BN.formatUnits(balanceStore.balances.TICKET?.balance ?? 0);
  // const ticketsBalance = deposited
  //   .div(TICKET_PRICE)
  //   .toDecimalPlaces(0, BigNumber.ROUND_DOWN);

  const totalPnL = new BN(stats?.totalPnL ?? "0");
  const totalPnLUSD = totalPnL.times(balanceStore.prices.ETH ?? 0);

  return (
    <PageContainer style={{ gap: "32px" }}>
      {claimableBalance.gt(0) && (
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
          <Button style={{ marginTop: 16 }}>
            Claim &nbsp; <img src={starsIcon} alt="stars" />
          </Button>
        </Column>
      )}

      {/* <img
        src={achievementsImage}
        alt="achievements"
        style={{ width: "100%" }}
      /> */}
      <Column crossAxisSize="max">
        <BlockTitle>Total PnL</BlockTitle>
        <Row alignItems="flex-end">
          <PageTitle>{totalPnL.toSignificant(4).toFormat()} ETH</PageTitle>
          <SizedBox width={8} />
          <SecondaryTitle color={totalPnL.gte(0) ? "#19F096" : "#ED5959"}>
            {totalPnLUSD.gte(0) ? "" : "-"}$
            {totalPnLUSD.abs().toSignificant(2).toFormat()}
          </SecondaryTitle>
        </Row>
        {stats && stats.userStrategies && stats.userStrategies.length > 0 && (
          <TradesHistory strategies={stats.userStrategies} />
        )}

        {/* <SizedBox height={16} /> */}
        {/* <BlockTitle>Trades</BlockTitle>
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
        </Row> */}
        {/* {pnlChart && pnlChart.length > 0 && (
          <Section style={{ marginTop: 16 }}>
            <PnLChart data={pnlChart} />
            <Row justifyContent="center">
              <BlockTitle>Last 30 days PnL </BlockTitle>
            </Row>
          </Section>
        )} */}
      </Column>
      <PageTitle>Referrals</PageTitle>
      <Referrals />
      <SizedBox height={32} />
    </PageContainer>
  );
});

export default MainScreen;
