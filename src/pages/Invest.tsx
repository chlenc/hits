import React from "react";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import Section from "../components/Section";
import styled from "@emotion/styled";
import { Column, Row } from "../components/Flex";
import SizedBox from "../components/SizedBox";
import Input from "../components/Input";
import Button from "../components/Button";
import walletIcon from "../assets/icons/wallet.svg";

const Subtitle = styled.h2`
  font-family: "Instrument Serif";
  font-size: 28px;
  font-style: italic;
  font-weight: 400;
  line-height: 125%; /* 35px */
  letter-spacing: -0.56px;
  margin: 0;
`;

const SectionTitle = styled.h5`
  text-align: center;
  font-family: "Instrument Sans";
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 120%; /* 19.2px */
  letter-spacing: -0.16px;
  margin: 0 0 24px 0;
`;

const SecondaryText = styled.div<{ color?: string }>`
  color: ${({ color }) => color || "#6f6f70"};
  text-align: center;

  font-family: "Instrument Sans";
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%; /* 16.8px */
  letter-spacing: -0.12px;
`;

const Invest: React.FC = () => {
  return (
    <PageContainer>
      <Column>
        <PageTitle>Strategy 1</PageTitle>
        <Subtitle>BTC should grows over $120 000 until 05.06.2025</Subtitle>
      </Column>
      <Row>
        <SecondaryText>Duration: 1 week</SecondaryText>
        <SizedBox width={16} />
        <SecondaryText>Min. deposit: 0.1 SOL</SecondaryText>
      </Row>
      <Section>
        <SectionTitle>Enter SOL amount</SectionTitle>
        <Input value="0.5 SOL" />
        <SizedBox height={16} />
        <Row gap={8} justifyContent="center">
          <SecondaryText color="#E478FE">↓ 0.623 SOL</SecondaryText>
          <SecondaryText color="#19F096">↑ 1.423 SOL</SecondaryText>
        </Row>
        <SizedBox height={24} />
        <Row justifyContent="center" alignItems="center" gap={4}>
          <img width={12} height={12} src={walletIcon} alt="wallet" />
          <SecondaryText>Balance: 12.51 SOL</SecondaryText>
        </Row>
        <SizedBox height={16} />
        <Button>Trade</Button>
        <SizedBox height={16} />
        <SecondaryText>The offer will renew in 00:00:52</SecondaryText>
      </Section>
    </PageContainer>
  );
};

export default Invest;
