import React from "react";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import { useWalletConnectRedirect } from "../hooks/useWalletConnectRedirect";
import { useStores } from "../stores/useStores";
import { observer } from "mobx-react-lite";
import StrategyCard from "../components/StrategyCard";
import { Row } from "../components/Flex";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Trades: React.FC = observer(() => {
  const { accountStore } = useStores();
  useWalletConnectRedirect({
    redirectPath: "/strategies",
    autoOpenModal: true,
  });

  return (
    <PageContainer>
      <Row justifyContent="space-between" alignItems="center">
        <PageTitle>My trades</PageTitle>
        <ConnectButton
          showBalance={true}
          accountStatus="avatar"
          chainStatus="icon"
        />
      </Row>
      {accountStore.tradingStats?.userStrategies.map((strategy) => (
        <StrategyCard
          key={strategy.id}
          strategy={strategy}
          onClaim={strategy.status === "Expired" ? () => {} : undefined}
        />
      ))}
    </PageContainer>
  );
});

export default Trades;
