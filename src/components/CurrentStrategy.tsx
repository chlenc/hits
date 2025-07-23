import styled from "@emotion/styled";
import dayjs from "dayjs";
import React from "react";
import { useNavigate } from "react-router-dom";
import ethIcon from "../assets/icons/eth.svg";
import plusIcon from "../assets/icons/plus.svg";
import starsIcon from "../assets/icons/stars.svg";
import type { Strategy } from "../services/api";
import BN from "../utils/BN";
import updateCountdown from "../utils/updateCountdown";
import Button from "./Button";
import { Column, Row } from "./Flex";
import PriceChart from "./PriceChart";
import SizedBox from "./SizedBox";
import { TICKET_PRICE } from "../configs/networkConfig";

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

const BasicBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  font-family: "Instrument Sans";
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 100%;
  letter-spacing: -0.12px;

  height: 24px;
  padding: 0 8px;

  border-radius: 16px;
  box-sizing: border-box;
  z-index: 1;
  background: #2b2a2a;
  color: #d9d9d9;
`;

const Status = styled(BasicBadge)<{ status: "Active" | "Open" | "Expired" }>`
  background: ${({ status }) =>
    status === "Active"
      ? "#70EC9E"
      : status === "Expired"
      ? "#4E4C51"
      : "#8F4AF5"};
  color: ${({ status }) => (status === "Active" ? "#000" : "#fff")};
  border: 1px solid
    ${({ status }) => (status === "Active" ? "#70EC9E" : "#222024")};
`;

const ProfitBadge = styled(BasicBadge)<{ status: "profit" | "loss" }>`
  background: transparent;
  color: ${({ status }) => (status === "profit" ? "#70EC9E" : "#ED5959")};
  border: 1px solid
    ${({ status }) => (status === "profit" ? "#70EC9E" : "#ED5959")};
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

// const ChangePercentText = styled(ValueTitle)<{ isNegative?: boolean }>`
//   font-size: 24px;
//   line-height: 140%;
//   letter-spacing: -0.48px;
//   color: ${({ isNegative }) => (isNegative ? "#9A45FE" : "#19F096")};
// `;

// const StyledButton = styled(Button)`
//   position: absolute;
//   right: 16px;
//   bottom: 16px;
//   max-width: 110px;
//   z-index: 1;
// `;

export const CurrentStrategy: React.FC<StrategyCardProps> = ({
  strategy,
  onClaim,
}) => {
  const navigate = useNavigate();

  // Countdown to depositUntil
  const [startsIn, setStartsIn] = React.useState<string>("");
  const [activeUntil, setActiveUntil] = React.useState<string>("");

  // strategy.income = 0.054321; //fixme
  // strategy.userDeposit = 0.05 * 10 ** 18; //fixme
  // strategy.userIncome = 0.08 * 10 ** 18; //fixme

  const pnl =
    strategy.status === "Expired"
      ? new BN(strategy.income ?? 0).times(100)
      : BN.ZERO;

  const userDeposit = BN.formatUnits(strategy?.userDeposit ?? 0, 18);
  const userTickets = userDeposit.div(TICKET_PRICE);

  const userIncome = BN.formatUnits(strategy?.userIncome ?? 0, 18);
  const userIncomePct = userIncome.div(userDeposit).times(100);


  React.useEffect(() => {
    if (strategy.depositUntil) {
      updateCountdown(strategy.depositUntil, setStartsIn);
      updateCountdown(strategy.expiration, setActiveUntil);
      const interval = setInterval(() => {
        updateCountdown(strategy.depositUntil, setStartsIn);
        updateCountdown(strategy.expiration, setActiveUntil);
      }, 1000 * 60);
      return () => clearInterval(interval);
    }
  }, [strategy.depositUntil, strategy.expiration]);


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
            {dayjs(strategy.depositUntil).format("D MMM, HH:mm")} —{" "}
            {dayjs(strategy.expiration).format("D MMM, HH:mm")}
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
          <Status status={strategy.status}>{strategy.status}</Status>
        )}
      </Row>
      <SizedBox height={16} />
      <Title>{strategy.symbol} breaks the range?</Title>
      <SizedBox height={16} />
      {strategy.status === "Active" && (
        <>
          <Row justifyContent="space-between" alignItems="center">
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
          <Row justifyContent="space-between" alignItems="center">
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
              {userTickets.eq(0) && "You didn’t play this one"}
              {userTickets.gt(0) &&
                userIncome.gt(0) &&
                `You won ${userIncome.toFormat()} ${strategy.symbol}`}
              {userTickets.gt(0) &&
                userIncome.lte(0) &&
                `You burned ${userTickets.toFormat()} tickets`}
            </ValueTitle>
            <ValueTitle color="#70EC9E">
              {userTickets.gt(0) &&
                userIncome.gt(0) &&
                userIncomePct.toSignificant(2).toFormat()}
            </ValueTitle>
          </Row>
        </>
      )}

      {strategy.status === "Open" && userTickets.gt(0) && (
        <Row style={{ marginBottom: 16 }}>
          <ValueTitle>You’re in with 2 tickets</ValueTitle>
        </Row>
      )}

      {strategy.status !== "Open" && (
        <>
          <SizedBox height={16} />
          <PriceChart
            lineColor={isProfit ? "#70EC9E" : "#ED5959"}
            upper={strategy.breakoutRange?.max}
            lower={strategy.breakoutRange?.min}
            to={dayjs(strategy.expiration).unix() * 1000}
            from={dayjs(strategy.depositUntil).unix() * 1000}
          />
        </>
      )}
      {strategy.status === "Open" && (
        <Button onClick={() => navigate(`/payment`)} style={{ marginTop: 16 }}>
          Join&nbsp;
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

export default CurrentStrategy;
