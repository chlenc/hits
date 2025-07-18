import styled from "@emotion/styled";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import dayjs from "dayjs";
import { observer } from "mobx-react-lite";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useConfig, useSendTransaction } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import arrowIcon from "../../assets/icons/arrow.svg";
import walletIcon from "../../assets/icons/wallet.svg";
import tickerPicture from "../../assets/images/ticketPreview.svg";
import Button from "../../components/Button";
import { Row } from "../../components/Flex";
import Loading from "../../components/Loading";
import PageContainer from "../../components/PageContainer";
import PageTitle from "../../components/PageTitle";
import Section from "../../components/Section";
import SizedBox from "../../components/SizedBox";
import Switch from "../../components/Switch";
import { TICKET_PRICE } from "../../configs/networkConfig";
import { useStores } from "../../stores/useStores";
import BN from "../../utils/BN";
import updateCountdown from "../../utils/updateCountdown";
import { PaymentScreenVMProvider, usePaymentScreenVM } from "./PaymentScreenVM";

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

const PrimaryText = styled.div<{}>`
  color: #fff;

  /* H5 */
  font-family: "Instrument Sans";
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 120%; /* 19.2px */
  letter-spacing: -0.16px;
`;

const SecondaryText = styled.div<{
  align?: "left" | "right" | "center";
  color?: string;
}>`
  color: ${({ color }) => color || "#6f6f70"};
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

const PaymentImpl: React.FC = observer(() => {
  const navigate = useNavigate();
  const modal = useConnectModal();
  const { sendTransactionAsync } = useSendTransaction();
  const config = useConfig();

  const { accountStore, balanceStore, strategiesStore } = useStores();
  const paymentVM = usePaymentScreenVM();

  const { id: strategyId } = useParams<{ id: string }>();
  const strategy = strategiesStore.getStrategyById(strategyId ?? "");

  const [timeLeft, setTimeLeft] = React.useState<string>("");
  const [useCashback, setUseCashback] = React.useState<boolean>(false);

  const cashback = useCashback ? paymentVM.cashback : 0;
  const balance = paymentVM.ethBalance;
  const price = new BN(paymentVM.ticketAmount * TICKET_PRICE - cashback)
    .toSignificant(4)
    .toFormat();

  if (strategiesStore.initialized && !strategy) {
    navigate("/strategies");
    return;
  }

  React.useEffect(() => {
    if (strategy?.depositUntil) {
      updateCountdown(strategy.depositUntil, setTimeLeft);
      const interval = setInterval(
        () => updateCountdown(strategy?.depositUntil, setTimeLeft),
        1000 * 60
      );
      return () => clearInterval(interval);
    }
  }, [strategy?.depositUntil]);

  const handleBuyTickets = async () => {
    paymentVM.setError(null);

    // Check if user has enough balance
    const requiredBalance = paymentVM.ticketAmount * TICKET_PRICE;
    const currentBalance = Number(balance);

    if (currentBalance < requiredBalance) {
      paymentVM.setError("Insufficient balance");
      return;
    }

    paymentVM.setIsLoading(true);

    try {
      const { networkConfig, address } = accountStore;
      if (!networkConfig || !address) {
        throw new Error("Network config or address not available");
      }

      const { contract } = networkConfig;

      // Send transaction using wagmi
      const hash = await sendTransactionAsync({
        to: contract as `0x${string}`,
        value: BigInt(
          (paymentVM.ticketAmount * TICKET_PRICE * 10 ** 18).toString()
        ),
      });

      // Wait for transaction confirmation
      const receipt = await waitForTransactionReceipt(config, {
        hash,
        chainId: networkConfig.chainId,
      });

      if (receipt.status === "success") {
        // Update balances after successful transaction
        await balanceStore.updateTokenBalances();
      }

      // Reset ticket amount after initiating purchase
      paymentVM.setTicketAmount(1);

      navigate("/strategies");
    } catch (err) {
      console.error("Error buying tickets:", err);
      paymentVM.setError(
        err instanceof Error ? err.message : "Failed to buy tickets"
      );
    } finally {
      paymentVM.setIsLoading(false);
    }
  };

  if (!strategiesStore.initialized) return <Loading />;

  const volatilityColor =
    strategy?.estimatedVolatility === "Low"
      ? "#ED5959" // red
      : strategy?.estimatedVolatility === "Medium"
      ? "#FF8D44" // yellow
      : strategy?.estimatedVolatility === "High"
      ? "#70EC9E" // green
      : undefined;

  return (
    <PageContainer>
      <Row justifyContent="space-between" alignItems="center">
        <PageTitle>{strategy?.title}</PageTitle>
        <ConnectButton
          showBalance={true}
          accountStatus="avatar"
          chainStatus="icon"
        />
      </Row>
      <SubTitle>
        Given {strategy?.estimatedVolatility?.toLocaleLowerCase()} volatility,
        will {strategy?.symbol} rise or fall by{" "}
        {dayjs("2025-07-19").format("DD.MM.YYYY")}?
      </SubTitle>
      <Section>
        <SectionTitle>Buy tickets</SectionTitle>
        <SizedBox height={24} />
        <Row
          justifyContent="space-between"
          mainAxisSize="stretch"
          alignItems="center"
        >
          <StyledButton secondary onClick={paymentVM.decrementTicketAmount}>
            -
          </StyledButton>
          <img src={tickerPicture} alt="ticket" />
          <StyledButton secondary onClick={paymentVM.incrementTicketAmount}>
            +
          </StyledButton>
        </Row>
        <SizedBox height={16} />
        <AmountText> {price} ETH</AmountText>
        <SizedBox height={16} />
        <SecondaryText color={volatilityColor} align="center">
          Estimated volatility: {strategy?.estimatedVolatility}
        </SecondaryText>
        <SizedBox height={16} />
        <Row alignItems="center" justifyContent="center">
          <img src={walletIcon} alt="icon" width={12} />
          &nbsp;
          <SecondaryText>
            Balance: {new BN(balance).toSignificant(4).toFormat()} ETH
          </SecondaryText>
        </Row>
        <SizedBox height={24} />
        <Row alignItems="center" justifyContent="space-between">
          <PrimaryText>Use cashback</PrimaryText>
          <Switch checked={useCashback} onChange={setUseCashback} />
        </Row>
        <SecondaryText>{paymentVM.cashback} ETH avalible</SecondaryText>
        <SizedBox height={24} />
        {paymentVM.error && (
          <>
            <SecondaryText align="center" style={{ color: "#ff6b6b" }}>
              {paymentVM.error}
            </SecondaryText>
            <SizedBox height={16} />
          </>
        )}
        {accountStore.isConnected ? (
          <Button onClick={handleBuyTickets} disabled={paymentVM.isLoading}>
            {paymentVM.isLoading
              ? "Processing..."
              : `Buy ${paymentVM.ticketAmount} tickets`}{" "}
            &nbsp;
            {!paymentVM.isLoading && <img src={arrowIcon} alt="arrowIcon" />}
          </Button>
        ) : (
          <Button onClick={modal?.openConnectModal}>Connect wallet</Button>
        )}
        <SizedBox height={16} />
        <SecondaryText align="center">
          The offer will renew in {timeLeft}
        </SecondaryText>
        <SizedBox height={16} />
        <PrimaryText
          style={{ cursor: "pointer", padding: "8px", textAlign: "center" }}
          onClick={() => navigate("/trades")}
        >
          Cancel
        </PrimaryText>
      </Section>
    </PageContainer>
  );
});

const PaymentScreen: React.FC = () => (
  <PaymentScreenVMProvider>
    <PaymentImpl />
  </PaymentScreenVMProvider>
);
export default PaymentScreen;
