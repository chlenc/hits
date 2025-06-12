import styled from "@emotion/styled";
import React from "react";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import SizedBox from "../components/SizedBox";
import Button from "../components/Button";
import copyIcon from "../assets/icons/copy.svg";
import { Column, Row } from "../components/Flex";
import Input from "../components/Input";
import Section from "../components/Section";


const SectionTitle = styled.h5`
  font-family: "Instrument Sans";
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 120%; /* 19.2px */
  letter-spacing: -0.16px;
  margin: 0;
`;

const SecondaryText = styled.div<{ align?: "left" | "right" | "center" }>`
  color: #6f6f70;
  text-align: ${({ align }) => align || "left"};

  font-family: "Instrument Sans";
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%; /* 16.8px */
  letter-spacing: -0.12px;
`;

const referrals = [
  { link: "t.me/sgasgasjitwj2984", reward: 10 },
  { link: "t.me/k34tjht8282", reward: 5 },
  { link: "t.me/lsoooptetwqsd", reward: 5 },
  { link: "t.me/j5j5j45jffsgsag", reward: 5 },
  { link: "t.me/gkrutraew591qpqqq", reward: 5 },
];

const Referrals: React.FC = () => {
  return (
    <PageContainer>
      <PageTitle>Referrals</PageTitle>
      <Section>
        <SectionTitle>My referral link</SectionTitle>
        <SizedBox height={24} />
        <Input value="https://t.me/sgasgasjitwj2984" />
        <SizedBox height={24} />
        <Button>
          Copy link &nbsp; <img src={copyIcon} alt="copy" />
        </Button>
        <SizedBox height={16} />
        <SecondaryText align="center">
          The offer will renew in 00:00:52
        </SecondaryText>
      </Section>
      <Section>
        <SectionTitle>My referrals</SectionTitle>
        <SizedBox height={24} />
        <Column gap={16} crossAxisSize="max">
          {referrals.map((referral) => (
            <Row key={referral.link} justifyContent="space-between">
              <SecondaryText>{referral.link}</SecondaryText>
              <SecondaryText align="right">
                +{referral.reward} SOL
              </SecondaryText>
            </Row>
          ))}
        </Column>
      </Section>
    </PageContainer>
  );
};

export default Referrals;
