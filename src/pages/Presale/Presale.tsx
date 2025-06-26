import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import PageContainer from "../../components/PageContainer";
import PageTitle from "../../components/PageTitle";
import SizedBox from "../../components/SizedBox";
import Button from "../../components/Button";
import { Row } from "../../components/Flex";
import Section from "../../components/Section";
import tickerPicture from "../../assets/images/ticketPreview.svg";
import ticketIcon from "../../assets/icons/ticket.svg";
import walletIcon from "../../assets/icons/wallet.svg";
import arrowIcon from "../../assets/icons/arrow.svg";
import { useStores } from "../../stores/useStores";
import { observer } from "mobx-react-lite";
import BN from "../../utils/BN";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import {
  useContractRead,
  useContractWrite,
  useWaitForTransactionReceipt,
} from "wagmi";
import { presaleAbi } from "../../configs/presaleAbi";
import { parseEther } from "viem";
import { PresaleVMProvider, usePresaleVM } from "./PresaleVM";
import { TICKET_PRICE } from "../../configs/networkConfig";

const SectionTitle = styled.h5`
  font-family: "Instrument Sans";
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 120%; /* 19.2px */
  letter-spacing: -0.16px;
  margin: 0;
  text-align: center;
`;
const SubTitle = styled.h6`
  color: #fff;
  font-family: "Instrument Serif";
  font-size: 28px;
  font-style: italic;
  font-weight: 400;
  line-height: 125%; /* 35px */
  letter-spacing: -0.56px;
  margin: 0;
`;

const AmountText = styled.div`
  color: #fff;
  text-align: center;

  font-family: "Instrument Sans";
  font-size: 28px;
  font-style: normal;
  font-weight: 500;
  line-height: 110%; /* 30.8px */
  letter-spacing: -0.28px;
`;

const MainnetLaunchText = styled.div`
  color: #70ec9e;
  color: color(display-p3 0.4392 0.9255 0.6196);
  text-align: center;

  /* Caption */
  font-family: "Instrument Sans";
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%; /* 16.8px */
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

const StyledButton = styled(Button)`
  border-radius: 48px;
  width: 48px;
`;

const PresaleImpl: React.FC = observer(() => {
  const { accountStore, balanceStore } = useStores();
  const presaleVM = usePresaleVM();
  const modal = useConnectModal();

  const balance = balanceStore.balances.ETH?.balance ?? "0";
  const price = new BN(presaleVM.ticketAmount * TICKET_PRICE).toFormat(4);

  return (
    <PageContainer>
      <Row justifyContent="flex-end">
        <ConnectButton />
      </Row>
      <PageTitle>Hits4fun Whitelist</PageTitle>
      <SubTitle>Buy now, use at Mainnet.</SubTitle>
      <Section>
        <SectionTitle>Buy tickets</SectionTitle>
        <SizedBox height={24} />
        <Row
          justifyContent="space-between"
          mainAxisSize="stretch"
          alignItems="center"
        >
          <StyledButton secondary onClick={presaleVM.decrementTicketAmount}>
            -
          </StyledButton>
          <img src={tickerPicture} alt="ticket" />
          <StyledButton secondary onClick={presaleVM.incrementTicketAmount}>
            +
          </StyledButton>
        </Row>
        <SizedBox height={16} />
        <AmountText> {price} ETH</AmountText>
        <SizedBox height={16} />
        <MainnetLaunchText>Mainnet launch: Aug 2025</MainnetLaunchText>
        <SizedBox height={16} />
        <Row justifyContent="space-between">
          <Row alignItems="center">
            <img src={walletIcon} alt="icon" width={12} />
            &nbsp;
            <SecondaryText>
              Balance: {new BN(balance).toFormat(4)} ETH
            </SecondaryText>
          </Row>
          <Row alignItems="center" justifyContent="flex-end">
            <img src={ticketIcon} alt="icon" />
            &nbsp;
            <SecondaryText>{presaleVM.ticketBalance}</SecondaryText>
          </Row>
        </Row>
        <SizedBox height={24} />
        {presaleVM.error && (
          <>
            <SecondaryText align="center" style={{ color: "#ff6b6b" }}>
              {presaleVM.error}
            </SecondaryText>
            <SizedBox height={16} />
          </>
        )}
        {accountStore.isConnected ? (
          <Button onClick={presaleVM.handleBuyTickets} disabled={presaleVM.isLoading}>
            {presaleVM.isLoading ? "Processing..." : `Buy ${presaleVM.ticketAmount} tickets`} &nbsp;
            {!presaleVM.isLoading && <img src={arrowIcon} alt="arrowIcon" />}
          </Button>
        ) : (
          <Button onClick={modal?.openConnectModal}>Connect wallet</Button>
        )}
        <SizedBox height={16} />
        <SecondaryText align="center">
          Early birds are eligible for airdrop, <br />
          cashback and referral boost.
        </SecondaryText>
      </Section>
    </PageContainer>
  );
});

const Presale: React.FC = () => (
  <PresaleVMProvider>
    <PresaleImpl />
  </PresaleVMProvider>
);
export default Presale;
