import styled from "@emotion/styled";
import { Column, Row } from "../../components/Flex";
import PageTitle from "../../components/PageTitle";
import type { Strategy } from "../../services/api";
import dayjs from "dayjs";
import BN from "../../utils/BN";

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

const StrategyItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  box-sizing: border-box;
  border-bottom: 1px solid #2b2a2a;
  width: 100%;
  gap: 16px;
`;

const TradesHistory = ({ strategies }: TradesHistoryProps) => {
  return (
    <Column style={{ marginTop: 32 }} crossAxisSize="max">
      <Title>Trades History</Title>
      {strategies.map((strategy) => {
        return (
          <StrategyItem key={strategy.id}>
            <Row>
              {dayjs(strategy.depositUntil).format("D MMM, HH:mm")} —{" "}
              {dayjs(strategy.expiration).format("D MMM, HH:mm")}
            </Row>
            <Row>
              <div style={{ width: "50%" }}>
                {new BN(strategy.userDeposit ?? 0).toFormat()} ETH
              </div>
              <div style={{ width: "50%" }}>
                {strategy.status === "Expired"
                  ? `${new BN(strategy.userIncome ?? 0).toFormat()} ${
                      strategy.symbol
                    }`
                  : `-`}
              </div>
            </Row>
            <Row>
              <div style={{ width: "50%" }}>Invested</div>
              <div style={{ width: "50%" }}>Result</div>
            </Row>
          </StrategyItem>
        );
      })}
    </Column>
  );
};

export default TradesHistory;
