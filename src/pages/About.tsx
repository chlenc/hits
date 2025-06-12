import React from "react";
import styled from "@emotion/styled";
import PageTitle from "../components/PageTitle";
import PageContainer from "../components/PageContainer";


const ItalicText = styled.span`
  font-style: italic;
  font-size: 24px;
  margin-bottom: 32px;
  display: block;
  color: #fff;
  font-family: Georgia, serif;
`;

const Text = styled.div`
  font-size: 18px;
  line-height: 1.6;
  color: #fff;
  margin-bottom: 32px;
  font-family: Inter, Arial, sans-serif;
`;

const FadedText = styled.div`
  color: #888;
  font-size: 18px;
  font-family: Inter, Arial, sans-serif;
`;

const About: React.FC = () => (
  <PageContainer>
    <PageTitle>
      How the Strategy Works
    </PageTitle>
    <ItalicText>
      Two options. One structure.
      <br />
      Volatility is your friend.
    </ItalicText>
    <Text>
      Every day, 1 hour before U.S. markets open, you can place a "Structure" —
      a dual-option bet on a chosen asset. We set upper and lower bounds on BTC.
      If BTC stays flat — small loss. If it moves beyond the bounds — your
      profit grows. Big moves = big wins.
    </Text>
    <FadedText>
      The structure closes at U.S. market close.
      <br />
      You instantly see your result.
    </FadedText>
  </PageContainer>
);

export default About;
