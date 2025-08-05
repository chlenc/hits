import styled from "@emotion/styled";
import { observer } from "mobx-react-lite";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useStores } from "../stores/useStores";
import centerEllipsis from "../utils/centerEllipsis";
import Button from "./Button";
import Tooltip from "../pages/PaymentScreen/temp/Tooltip";
import { CircularProgress } from "../pages/PaymentScreen/temp/CircularProgress";

const InvoiceModal = observer(() => {
  const { invoiceStore } = useStores();
  const { isModalOpen, invoiceData, closeModal } = invoiceStore;
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [timeLeftProgress, setTimeLeftProgress] = useState<number>(100);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (!invoiceData?.expirationEstimateDate) return;

    const updateTimer = () => {
      const now = new Date();
      const expiration = new Date(invoiceData.expirationEstimateDate);
      const diff = expiration.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Expired");
        setTimeLeftProgress(0);
        return;
      }

      const totalDuration = 20 * 60 * 1000; // 20 minutes in milliseconds
      const progress = (diff / totalDuration) * 100;
      setTimeLeftProgress(progress);

      const minutes = Math.floor(diff / 1000 / 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [invoiceData?.expirationEstimateDate]);

  const handleCopyAddress = () => {
    if (invoiceData?.payAddress) {
      navigator.clipboard.writeText(invoiceData.payAddress);
      toast.success("Address copied to clipboard!");
    }
  };
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;
  if (!isModalOpen || !invoiceData) return null;
  return (
    <Container>
      <div style={modalContentStyle as any}>
        <Body>
          <CloseButton type="button" onClick={closeModal}>
            ×
          </CloseButton>

          <Title>Pay on {invoiceData.network.toUpperCase()}</Title>
          <Subtitle>
            Waiting payment:
            <span>
              {invoiceData.priceAmount} {invoiceData.token.toUpperCase()}
            </span>
            <Tooltip
              content={<InfoContainer>Time left: {timeLeft}</InfoContainer>}
            >
              <CircularProgress progress={timeLeftProgress} />
            </Tooltip>
          </Subtitle>
          <Subtitle style={{ marginBottom: 16 }}>
            Status: <span>{invoiceData.paymentStatus}</span>
          </Subtitle>

          <QRCodeContainer active={invoiceData.paymentStatus === "waiting"}>
            <QRCodeSVG
              value={invoiceData.payAddress}
              level="H"
              bgColor="transparent"
              size={140}
            />
            <p>{centerEllipsis(invoiceData.payAddress, 10)}</p>
            <Button style={{ width: "100%" }} onClick={handleCopyAddress}>
              Copy
            </Button>
          </QRCodeContainer>
          <Warning>
            Make sure to send the exact amount of tokens you entered in the
            purchase field.
          </Warning>
        </Body>
      </div>
    </Container>
  );
});

const Container = styled.div`
  width: 100%;
  height: 100%;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InfoContainer = styled.div`
  color: white;
  padding: 10px;
  font-size: 14px;
`;

const modalContentStyle = {
  position: "relative",
  background: "#171717",
  borderRadius: "1rem",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.6)",
  padding: "1rem",
  zIndex: 10,
  maxWidth: "420px",
  width: "100%",
};

const Body = styled.div`
  border-radius: 14px;
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: bold;
  color: #ffffff;
  line-height: 1.2;
  margin-bottom: 12px;
`;

const Subtitle = styled.div`
  font-size: 16px;
  color: #ffffffbf;
  margin-bottom: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  & > * {
    color: white;
    font-weight: bold;
  }
`;

const QRCodeContainer = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  padding: 16px;
  background: #fff;
  width: 172px;
  font-size: 16px;
  color: #38424f;
  gap: 10px;
  filter: ${({ active }) => (active ? "none" : "blur(4px)")};
  margin-bottom: 24px;
`;

const Warning = styled.p`
  color: #ff3437;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 8px;
  background: #ff343712;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  color: #bfc3c9;
  font-size: 24px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding-bottom: 2px;
  background: transparent;
  transition: transform 0.2s ease-in-out;
  border: none;
  cursor: pointer;

  &:hover {
    transform: scale(1.2);
  }
`;

export default InvoiceModal;
