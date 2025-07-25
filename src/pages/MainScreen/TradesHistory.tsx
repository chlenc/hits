import styled from "@emotion/styled";
import { Column, Row } from "../../components/Flex";
import PageTitle from "../../components/PageTitle";
import type { Strategy } from "../../services/api";
import dayjs from "dayjs";
import BN from "../../utils/BN";
import useCountdown from "../../hooks/useCountdown";
import { StatusBadge } from "../../components/Badge";
import SizedBox from "../../components/SizedBox";

interface TradesHistoryProps {
  strategies: Strategy[];
}

const Title = styled(PageTitle)`
  width: 100%;
  padding: 16px 0;
  box-sizing: border-box;
  border-bottom: 1px solid #2b2a2a;
  border-top: 1px solid #2b2a2a;
`;

const TradesHistory = ({ strategies }: TradesHistoryProps) => {
  return (
    <Column style={{ marginTop: 32 }} crossAxisSize="max">
      <Title>Trades History</Title>
      {strategies.map((strategy) => (
        <StrategyItem key={strategy.id} strategy={strategy} />
      ))}
    </Column>
  );
};

const StrategyItemRoot = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  box-sizing: border-box;
  border-bottom: 1px solid #2b2a2a;
  width: 100%;
  gap: 8px;
`;

const Text = styled.div`
  color: #d9d9d9;
  font-family: "Instrument Sans";
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%; /* 16.8px */
  flex: 1;
`;

const Value = styled.div<{ color?: string }>`
  color: ${({ color }) => color || "#fff"};

  font-family: "Instrument Sans";
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%; /* 22.4px */
  letter-spacing: -0.16px;
  flex: 1;
`;

const StrategyItem = ({ strategy }: { strategy: Strategy }) => {
  const { userDeposit, symbol, status, expiration, depositUntil } = strategy;
  const userIncome =
    strategy.status === "Expired" ? strategy.userIncome ?? 0 : null;

  const { activeUntil } = useCountdown({ expiration });
  // console.log(activeUntil, strategy.expiration);

  return (
    <StrategyItemRoot key={strategy.id}>
      <Row alignItems="center">
        <Text style={{ color: "#D9D9D9", flex: "none" }}>
          {dayjs(depositUntil).format("D MMM, HH:mm")} —{" "}
          {dayjs(expiration).format("D MMM, HH:mm")}
        </Text>
        <SizedBox width={8} />
        <StatusBadge status={status}>{status}</StatusBadge>
      </Row>
      <Row>
        <Value>
          {new BN(userDeposit ?? 0).toFormat()} {symbol}
        </Value>
        {status === "Expired" ? (
          <Value color={userIncome! > 0 ? "#70EC9E" : "#ED5959"}>
            +{userIncome} {symbol}
          </Value>
        ) : (
          <Value>In {activeUntil}</Value>
        )}
      </Row>
      <Row>
        <Text>Invested</Text>
        <Text>Result</Text>
      </Row>
    </StrategyItemRoot>
  );
};
export default TradesHistory;
