import styled from "@emotion/styled";
import { useAppKit, useWalletInfo } from "@reown/appkit/react";
import { useAccount } from "wagmi";
import { useMemo } from "react";
import Button from "./Button";

const WalletButton = styled(Button)<{ secondary?: boolean }>`
  height: 40px;
  width: auto;
  min-width: ${({ secondary }) => (secondary ? "auto" : "120px")};
  padding: ${({ secondary }) => (secondary ? "8px 12px" : "0 20px")};
  font-size: ${({ secondary }) => (secondary ? "14px" : "16px")};
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Avatar = styled.div<{ $hasImage?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ $hasImage }) =>
    $hasImage
      ? "transparent"
      : "linear-gradient(114deg, #e478fe 17.57%, #9a45fe 81.44%)"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
  overflow: hidden;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AddressText = styled.span`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.14px;
`;

const WalletConnectButton = () => {
  const { open: openConnectModal } = useAppKit();
  const { address, isConnected } = useAccount();
  const { walletInfo } = useWalletInfo();

  const shortAddress = useMemo(() => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  const avatarText = useMemo(() => {
    if (!address) return "";
    return address.slice(2, 4).toUpperCase();
  }, [address]);

  // Получаем иконку кошелька из walletInfo
  const walletIcon = useMemo(() => {
    if (!walletInfo) return null;
    // Попробуем разные возможные поля для иконки
    const info = walletInfo as any;
    return (
      info?.walletIcon ||
      info?.logo ||
      info?.image ||
      info?.imageUrl ||
      info?.icon ||
      null
    );
  }, [walletInfo]);

  if (isConnected && address) {
    return (
      <WalletButton secondary onClick={() => openConnectModal?.()}>
        <Avatar $hasImage={!!walletIcon}>
          {walletIcon ? (
            <AvatarImage src={walletIcon} alt="Wallet icon" />
          ) : (
            avatarText
          )}
        </Avatar>
        <AddressText>{shortAddress}</AddressText>
      </WalletButton>
    );
  }

  return (
    <WalletButton onClick={() => openConnectModal?.()}>
      Connect wallet
    </WalletButton>
  );
};

export default WalletConnectButton;
