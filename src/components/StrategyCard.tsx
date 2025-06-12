import React from "react";
import styled from "@emotion/styled";
import { Column, Row } from "./Flex";
import SizedBox from "./SizedBox";
import Button from "./Button";
import starsIcon from "../assets/icons/stars.svg";
import plusIcon from "../assets/icons/plus.svg";

// Типы пропсов
export type StrategyCardProps = {
  title: string;
  status: "in progress" | "finished";
  yieldPercent: string;
  amount: string;
  asset: string;
  income?: string;
  incomeChange?: string;
  expiration: string;
  onClaim?: () => void;
  onInvest?: () => void;
  chartSrc?: string;
};

const Card = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;

  border-radius: 32px;
  padding: 28px 16px;
  box-sizing: border-box;
  border: 2px solid transparent;
  border-radius: 32px;

  /* слой 1 — заливка, слой 2 — градиент */
  background-image: linear-gradient(#000, #000),
    /* fill   */ linear-gradient(135deg, #19f096 0%, #6aacff 60%, #8f4af5 100%); /* border */

  /* говорим, где рисовать слои */
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;
`;

const Title = styled.div`
  font-family: "Instrument Serif";
  font-size: 50px;
  font-style: italic;
  font-weight: 400;
  line-height: 125%; /* 62.5px */
  letter-spacing: -1px;
  line-height: 105%; /* 50.4px */
  letter-spacing: -0.96px;
  z-index: 1;
`;

const Status = styled.span<{ status: string }>`
  display: flex;
  align-items: center;
  justify-content: center;

  font-family: "Instrument Sans";
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%; /* 16.8px */
  letter-spacing: -0.12px;

  height: 24px;
  padding: 0 8px;

  border-radius: 16px;
  background: ${({ status }) =>
    status === "in progress" ? "#19F096" : "transparent"};
  color: ${({ status }) => (status === "in progress" ? "#000" : "#9A45FE")};
  border: 1px solid
    ${({ status }) => (status === "in progress" ? "#19F096" : "#9A45FE")};
  box-sizing: border-box;
  z-index: 1;
`;

const Text = styled.div`
  font-family: "Instrument Sans";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 22.4px */
  letter-spacing: -0.16px;
  z-index: 1;
`;

const ExpirationTitle = styled(Text)`
  font-size: 12px;
  font-weight: 500;
  letter-spacing: -0.12px;
  margin-bottom: 8px;
`;

const ValueTitle = styled(Title)`
  font-style: normal;
`;

const ChangePercentText = styled(ValueTitle)<{ isNegative?: boolean }>`
  font-size: 24px;
  line-height: 140%;
  letter-spacing: -0.48px;
  color: ${({ isNegative }) => (isNegative ? "#9A45FE" : "#19F096")};
`;

const StyledButton = styled(Button)`
  position: absolute;
  right: 16px;
  bottom: 16px;
  max-width: 110px;
  z-index: 1;
`;
const ChartImage = styled.img`
  position: absolute;
  right: 16px;
  bottom: 16px;
  z-index: 0;
`;

export const StrategyCard: React.FC<StrategyCardProps> = ({
  title,
  status,
  yieldPercent,
  amount,
  asset,
  income,
  incomeChange,
  expiration,
  onClaim,
  onInvest,
  chartSrc,
}) => (
  <Card>
    <Row justifyContent="space-between">
      <Column>
        <Title>{title}</Title>
        <Status status={status}>
          {status === "in progress" ? "in progress" : "finished"}
        </Status>
      </Column>
      <Column alignItems="flex-end">
        <ExpirationTitle>Expiration day</ExpirationTitle>
        <Text>{expiration}</Text>
      </Column>
    </Row>
    <SizedBox height={32} />
    <Column>
      {status === "in progress" ? (
        <>
          <ValueTitle>{yieldPercent}</ValueTitle>
          <Text>Potential yield</Text>
          {/* <SizedBox height={24} /> */}
          <ValueTitle>${amount}</ValueTitle>
          <Text>{asset} grows over</Text>
        </>
      ) : (
        <>
          <Row alignItems="flex-end">
            <ValueTitle>{income}</ValueTitle>
            <SizedBox width={8} />
            <ChangePercentText isNegative={incomeChange?.startsWith("-")}>
              {incomeChange}
            </ChangePercentText>
          </Row>
          <Text>{asset} Income</Text>
          {/* <SizedBox height={24} /> */}
          <ValueTitle>${amount}</ValueTitle>
          <Text>{asset} grows over</Text>
        </>
      )}
    </Column>
    {onClaim && (
      <StyledButton onClick={onClaim}>
        Claim &nbsp;
        <img src={starsIcon} alt="starsIcon" />
      </StyledButton>
    )}{" "}
    {onInvest && (
      <StyledButton onClick={onInvest}>
        Invest &nbsp;
        <img src={plusIcon} alt="plusIcon" />
      </StyledButton>
    )}
    {chartSrc && <ChartImage src={chartSrc} alt="chart" />}
  </Card>
);

export default StrategyCard;
