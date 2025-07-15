import React from "react";
import styled from "@emotion/styled";
import { Column, Row } from "./Flex";
import SizedBox from "./SizedBox";
import Button from "./Button";
import userIcon from "../assets/icons/user.svg";
import strategyChartIcon from "../assets/icons/strategyChart.svg";
import starsIcon from "../assets/icons/stars.svg";
import type { Strategy } from "../services/api";
import dayjs from "dayjs";
import BN from "../utils/BN";
import { useNavigate } from "react-router-dom";
import updateCountdown from "../utils/updateCountdown";

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
  padding: 24px 16px;
  box-sizing: border-box;
  border: 2px solid transparent;
  border-radius: 32px;

  /* если статус Expired, фон #222024, иначе градиент */
  background: ${({ status }) =>
    status === "Expired"
      ? "#222024"
      : "linear-gradient(#000, #000), linear-gradient(135deg, #19f096 0%, #6aacff 60%, #8f4af5 100%)"};
  background-origin: ${({ status }) =>
    status === "Expired" ? "padding-box" : "padding-box, border-box"};
  background-clip: ${({ status }) =>
    status === "Expired" ? "padding-box" : "padding-box, border-box"};
`;

const Title = styled.div`
  font-family: "Instrument Serif";
  font-size: 50px;
  font-style: italic;
  font-weight: 400;
  line-height: 100%;
  z-index: 1;
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
`;

const Status = styled(BasicBadge)<{ status: "Active" | "Open" | "Expired" }>`
  background: ${({ status }) =>
    status === "Open"
      ? "#70EC9E"
      : status === "Expired"
      ? "#4E4C51"
      : "#8F4AF5"};
  color: ${({ status }) => (status === "Open" ? "#000" : "#fff")};
  border: 1px solid
    ${({ status }) => (status === "Open" ? "#70EC9E" : "#222024")};
`;

const ProfitBadge = styled(BasicBadge)<{ status: "profit" | "loss" }>`
  background: transparent;
  color: ${({ status }) => (status === "profit" ? "#70EC9E" : "#ED5959")};
  border: 1px solid
    ${({ status }) => (status === "profit" ? "#70EC9E" : "#ED5959")};
`;

const Text = styled.div`
  font-family: "Instrument Sans";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  z-index: 1;
`;

const ValueTitle = styled(Title)<{ color?: string }>`
  color: ${({ color }) => color};
  font-style: normal;
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
const ChartImage = styled.img`
  position: absolute;
  right: 16px;
  top: 126px;
  z-index: 0;
`;

export const StrategyCard: React.FC<StrategyCardProps> = ({
  strategy,
  onClaim,
}) => {
  const navigate = useNavigate();

  const expiration = dayjs(strategy.expiration).format("DD.MM.YYYY");
  // Countdown to depositUntil
  const [timeLeft, setTimeLeft] = React.useState<string>("");
  const income =
    strategy.status === "Expired"
      ? BN.formatUnits(strategy.income, 18)
      : BN.ZERO;

  // Calculate the percentage change from open to close price
  const percentChange =
    strategy.status === "Expired" && strategy.priceAtOpen
      ? ((Number(strategy.priceAtClose) - Number(strategy.priceAtOpen)) /
          Number(strategy.priceAtOpen)) *
        100
      : 0;

  // Calculate profit percentage when expired and profit > 0
  const profitPercentage =
    strategy.status === "Expired" && income.gt(0)
      ? (Number(income.toString()) / 0.006) * 100
      : 0;

  React.useEffect(() => {
    updateCountdown(strategy.depositUntil, setTimeLeft);
    const interval = setInterval(
      () => updateCountdown(strategy.depositUntil, setTimeLeft),
      1000 * 60
    ); // update every minute

    return () => clearInterval(interval);
  }, [strategy.depositUntil]);

  const volatilityColor =
    strategy.estimatedVolatility === "Low"
      ? "#ED5959" // red
      : strategy.estimatedVolatility === "Medium"
      ? "#FF8D44" // yellow
      : strategy.estimatedVolatility === "High"
      ? "#70EC9E" // green
      : undefined;
  return (
    <Card status={strategy.status}>
      <Row justifyContent="space-between" alignItems="center">
        <Title>{strategy.title}</Title>
        <Column alignItems="flex-end">
          <Text style={{ fontSize: 12, fontWeight: 500 }}>Expiration day</Text>
          <Text style={{ fontWeight: 600 }}>{expiration}</Text>
        </Column>
      </Row>
      <SizedBox height={8} />
      <Row alignItems="center">
        <Status status={strategy.status}>{strategy.status}</Status>
        <SizedBox width={8} />
        {strategy.status !== "Expired" ? (
          <>
            <img src={userIcon} alt="user" />
            <SizedBox width={4} />
            <Text style={{ fontSize: 12, fontWeight: 500 }}>
              {strategy.participants} 🔥
            </Text>
          </>
        ) : (
          <ProfitBadge status={income.gt(0) ? "profit" : "loss"}>
            {income.gt(0) ? "Profit" : "Loss"}
          </ProfitBadge>
        )}
      </Row>
      <SizedBox height={32} />
      <Column crossAxisSize="max">
        {strategy.status === "Open" && (
          <>
            <ValueTitle style={{ color: volatilityColor }}>
              {strategy.estimatedVolatility}
            </ValueTitle>
            <Text>Volatility</Text>
            <SizedBox height={24} />
            <ValueTitle>{timeLeft}</ValueTitle>
            <Text>Time remaining</Text>
          </>
        )}
        {strategy.status === "Active" && (
          <>
            <ValueTitle>${strategy.priceAtOpen}</ValueTitle>
            <Text>{strategy.symbol} price at open</Text>
            <SizedBox height={24} />
            <ValueTitle>
              ${strategy.breakoutRange.min}-${strategy.breakoutRange.max}
            </ValueTitle>
            <Text>Breakout range</Text>
          </>
        )}
        {strategy.status === "Expired" && (
          <>
            <Row alignItems="flex-end">
              <ValueTitle>
                ${income.toSignificant(4).toFormat()}&nbsp;
              </ValueTitle>
              {profitPercentage > 0 && (
                <ValueTitle
                  style={{ fontSize: 24, paddingBottom: 4 }}
                  color="#70EC9E"
                >
                  {profitPercentage.toFixed(2)}%
                </ValueTitle>
              )}
            </Row>
            <Text>{strategy.symbol} income</Text>
            <SizedBox height={24} />
            <Row justifyContent="space-between">
              <Column>
                <Row>
                  <ValueTitle style={{ fontSize: 24 }}>
                    ${strategy.priceAtClose} &nbsp;
                  </ValueTitle>
                  <ValueTitle
                    style={{ fontSize: 24 }}
                    color={percentChange > 0 ? "#70EC9E" : "#ED5959"}
                  >
                    {percentChange.toFixed(2)}%
                  </ValueTitle>
                </Row>
                <Text>{strategy.symbol} price at close</Text>
              </Column>
              <Column>
                <ValueTitle style={{ fontSize: 24 }}>
                  ${strategy.breakoutRange.min}-{strategy.breakoutRange.max}
                </ValueTitle>
                <Text>Breakout range</Text>
              </Column>
            </Row>
          </>
        )}
      </Column>
      {strategy.status === "Open" && (
        <Button
          onClick={() => navigate(`/strategy/${strategy.id}`)}
          style={{ marginTop: 24 }}
        >
          Join +{" "}
        </Button>
      )}

      {onClaim && (
        <Button style={{ marginTop: 24 }}>
          Claim&nbsp;
          <img src={starsIcon} alt="stars" />
        </Button>
      )}

      {strategy.status !== "Expired" && (
        <ChartImage src={strategyChartIcon} alt="chart" />
      )}
    </Card>
  );
};

export default StrategyCard;
