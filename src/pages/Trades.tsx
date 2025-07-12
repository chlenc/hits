import React from "react";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import { useWalletConnectRedirect } from "../hooks/useWalletConnectRedirect";
import { useStores } from "../stores/useStores";
import { observer } from "mobx-react-lite";
import StrategyCard from "../components/StrategyCard";

const Trades: React.FC = observer(() => {
  const { accountStore } = useStores();
  useWalletConnectRedirect({
    redirectPath: "/strategies",
    autoOpenModal: true,
  });

  return (
    <PageContainer>
      <PageTitle>My trades</PageTitle>
      {accountStore.tradingStats?.userStrategies.map((strategy) => (
        <StrategyCard
          key={strategy.id}
          strategy={strategy}
          onClaim={
            strategy.status === "Expired" ? () => {} : undefined
          }
        />
      ))}
    </PageContainer>
  );
});

export default Trades;
