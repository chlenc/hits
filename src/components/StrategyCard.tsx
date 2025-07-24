import styled from "@emotion/styled";
import dayjs from "dayjs";
import React from "react";
import { useNavigate } from "react-router-dom";
import ethIcon from "../assets/icons/eth.svg";
import plusIcon from "../assets/icons/plus.svg";
import starsIcon from "../assets/icons/stars.svg";
import type { Strategy } from "../services/api";
import BN from "../utils/BN";
import Button from "./Button";
import { Column, Row } from "./Flex";
import PriceChart from "./PriceChart";
import SizedBox from "./SizedBox";
import { TICKET_PRICE } from "../configs/networkConfig";
import BigNumber from "bignumber.js";
import useCountdown from "../hooks/useCountdown";
import { BasicBadge, ProfitBadge, StatusBadge } from "./Badge";

// Типы пропсов
export type StrategyCardProps = {
  strategy: Strategy;
  onClaim?: () => void;
};

const Card = styled.div<{ status: "Active" | "Open" | "Expired" }>`
  display: flex;
  flex-direction: column;
  position: relative;

  border-radius: 32px;
  padding: 16px;
  box-sizing: border-box;
  border: 2px solid transparent;
  border-radius: 32px;

  background: ${({ status }) =>
    status === "Expired"
      ? "transparent"
      : "linear-gradient(#000, #000) padding-box, linear-gradient(135deg, #19f096 0%, #6aacff 60%, #8f4af5 100%) border-box"};
  border: 2px solid
    ${({ status }) => (status === "Open" ? "transparent" : "#222024")};
  background-origin: ${({ status }) =>
    status === "Open" ? "padding-box, border-box" : "padding-box"};
  background-clip: ${({ status }) =>
    status === "Open" ? "padding-box, border-box" : "padding-box"};
`;

const Title = styled.div`
  font-family: "Instrument Serif";
  font-size: 34px;
  font-style: normal;
  font-weight: 400;
  line-height: 105%; /* 35.7px */
  letter-spacing: -0.34px;
`;

const Text = styled.div`
  font-family: "Instrument Sans";
  font-size: 12px;
  font-weight: 500;
  line-height: 140%; /* 16.8px */
  color: #6f6f70;
`;

const ValueTitle = styled.div<{ color?: string }>`
  color: ${({ color }) => color};
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 120%; /* 19.2px */
`;

export const StrategyCard: React.FC<StrategyCardProps> = ({
  strategy,
  onClaim,
}) => {
  const navigate = useNavigate();
  const { depositUntil, expiration } = strategy;
  const { startsIn, activeUntil } = useCountdown({ depositUntil, expiration });

  const pnl =
    strategy.status === "Expired"
      ? new BN(strategy.income ?? 0).times(100)
      : BN.ZERO;

  const userDeposit = new BN(strategy?.userDeposit ?? 0);
  const ticketsBalance = userDeposit
    .div(TICKET_PRICE)
    .toDecimalPlaces(0, BigNumber.ROUND_DOWN);

  let userIncome = BN.ZERO;
  let userIncomePct = BN.ZERO;
  if (strategy.status === "Expired") {
    userIncome = BN.formatUnits(strategy?.userIncome ?? 0, 18);
    userIncomePct = userIncome.div(userDeposit).times(100);
  }

  let isProfit = true;
  if (strategy.status === "Expired") isProfit = pnl.gte(0);

  // const income = strategy.income ?? 0;
  return (
    <Card status={strategy.status}>
      <Row alignItems="center">
        <img src={ethIcon} alt="eth" />
        <SizedBox width={8} />
        {strategy.status === "Open" ? (
          <BasicBadge>
            Deposit close in &nbsp;<b>{startsIn}</b>
          </BasicBadge>
        ) : (
          <BasicBadge>
            {dayjs(depositUntil).format("D MMM, HH:mm")} —{" "}
            {dayjs(expiration).format("D MMM, HH:mm")}
          </BasicBadge>
        )}
        <SizedBox width={8} />
        {strategy.status === "Expired" ? (
          isProfit ? (
            <ProfitBadge status="profit">Profit</ProfitBadge>
          ) : (
            <ProfitBadge status="loss">Loss</ProfitBadge>
          )
        ) : (
          <StatusBadge status={strategy.status}>{strategy.status}</StatusBadge>
        )}
      </Row>
      <SizedBox height={16} />
      <Title>{strategy.symbol} breaks the range?</Title>
      {strategy.status === "Active" && (
        <>
          <Row style={{ marginTop: 16 }} justifyContent="space-between">
            <Column>
              <ValueTitle>
                ${strategy.breakoutRange?.min}-{strategy.breakoutRange?.max}
              </ValueTitle>
              <Text>Breakout range</Text>
            </Column>
            <Column alignItems="flex-end">
              <ValueTitle>{activeUntil}</ValueTitle>
              <Text>Time remaining</Text>
            </Column>
          </Row>
        </>
      )}
      {strategy.status === "Expired" && (
        <>
          <Row style={{ marginTop: 16 }} justifyContent="space-between">
            <Column>
              <ValueTitle>
                ${strategy.breakoutRange?.min}-{strategy.breakoutRange?.max}
              </ValueTitle>
              <Text>Breakout range</Text>
            </Column>
            <Column alignItems="flex-end">
              <ValueTitle>${strategy.priceAtClose}</ValueTitle>
              <Text>{strategy.symbol} price at close</Text>
            </Column>
          </Row>
          <Row style={{ marginTop: 16 }} justifyContent="space-between">
            <ValueTitle>
              {ticketsBalance.eq(0) && "You didn’t play this one"}
              {ticketsBalance.gt(0) &&
                userIncome.gt(0) &&
                `You won ${userIncome.toFormat()} ${strategy.symbol}`}
              {ticketsBalance.gt(0) &&
                userIncome.lte(0) &&
                `You burned ${ticketsBalance.toFormat()} tickets`}
            </ValueTitle>
            <ValueTitle color="#70EC9E">
              {ticketsBalance.gt(0) &&
                userIncome.gt(0) &&
                userIncomePct.toSignificant(2).toFormat()}
            </ValueTitle>
          </Row>
        </>
      )}

      {["Open", "Active"].includes(strategy.status) && ticketsBalance.gt(0) && (
        <ValueTitle style={{ marginTop: 16 }}>
          You’re in with {ticketsBalance.toFormat()}{" "}
          {ticketsBalance.eq(1) ? "ticket" : "tickets"}
        </ValueTitle>
      )}

      {strategy.status !== "Open" && (
        <>
          <SizedBox height={16} />
          <PriceChart
            lineColor={isProfit ? "#70EC9E" : "#ED5959"}
            upper={strategy.breakoutRange?.max}
            lower={strategy.breakoutRange?.min}
            to={dayjs(expiration).unix() * 1000}
            from={dayjs(depositUntil).unix() * 1000}
          />
        </>
      )}
      {strategy.status === "Open" && (
        <Button onClick={() => navigate(`/payment`)} style={{ marginTop: 16 }}>
          {ticketsBalance.gt(0) ? "Increase position" : "Join"}&nbsp;
          <img src={plusIcon} alt="plus" />
        </Button>
      )}

      {onClaim && (
        <Button style={{ marginTop: 16 }}>
          Claim&nbsp;
          <img src={starsIcon} alt="stars" />
        </Button>
      )}
    </Card>
  );
};

export default StrategyCard;
