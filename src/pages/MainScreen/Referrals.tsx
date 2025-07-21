import styled from "@emotion/styled";
import React from "react";
import copyIcon from "../../assets/icons/copy.svg";
import Button from "../../components/Button";
import { Column, Row } from "../../components/Flex";
import Input from "../../components/Input";
import Section from "../../components/Section";
import SizedBox from "../../components/SizedBox";
// import starsIcon from "../assets/icons/stars.svg";
import { observer } from "mobx-react-lite";
import { useStores } from "../../stores/useStores";
import centerEllipsis from "../../utils/centerEllipsis";
import { copyToClipboard } from "../../utils/copyToClipboard";

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

const Referrals: React.FC = observer(() => {
  const { accountStore } = useStores();

  return (
    <>
      <Section>
        <SectionTitle>My referral link</SectionTitle>
        <SizedBox height={24} />
        <Input value={accountStore.referralLink ?? ""} readOnly />
        <SizedBox height={24} />
        <Button onClick={() => copyToClipboard(accountStore.referralLink)}>
          Copy link &nbsp; <img src={copyIcon} alt="copy" />
        </Button>
        {accountStore.userData?.referrer != null && (
          <SecondaryText align="center" style={{ marginTop: 16 }}>
            Your referer {centerEllipsis(accountStore.userData?.referrer)}
          </SecondaryText>
        )}
      </Section>
      {accountStore.refferals.length > 0 && (
        <Section>
          <SectionTitle>My referrals</SectionTitle>
          <SizedBox height={24} />
          <Column gap={16} crossAxisSize="max">
            {accountStore.refferals.map((referral, index) => (
              <Row key={referral.address} justifyContent="space-between">
                <SecondaryText>
                  {index + 1}. {centerEllipsis(referral.address)}
                </SecondaryText>
                {/* <SecondaryText align="right">
                +{referral.reward} SOL
              </SecondaryText> */}
              </Row>
            ))}
          </Column>
          {/* <SizedBox height={24} />
        <Button secondary>
          Claim all &nbsp; <img src={starsIcon} alt="stars" />
        </Button> */}
        </Section>
      )}
    </>
  );
});

export default Referrals;
