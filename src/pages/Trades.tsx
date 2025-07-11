import React from "react";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import StrategyCard from "../components/StrategyCard";
import { useWalletConnectRedirect } from "../hooks/useWalletConnectRedirect";

const Trades: React.FC = () => {
  useWalletConnectRedirect({
    redirectPath: "/strategies",
    autoOpenModal: true,
  });

  return (
    <PageContainer>
      <PageTitle>My trades</PageTitle>
      <StrategyCard
        title="Strategy 1"
        status="in progress"
        yieldPercent="6%"
        amount="120 000"
        asset="BTC"
        expiration="05.06.2025"
      />
      <StrategyCard
        title="Strategy 2"
        status="in progress"
        yieldPercent="6%"
        amount="120 000"
        asset="BTC"
        expiration="05.06.2025"
      />
      <StrategyCard
        title="Strategy 1"
        status="finished"
        yieldPercent=""
        income="0.000016"
        incomeChange="+1.74%"
        amount="120 000"
        asset="BTC"
        expiration="30.05.2025"
        onClaim={() => alert("Claimed!")}
      />
      <StrategyCard
        title="Strategy 2"
        status="finished"
        yieldPercent=""
        income="2.2566"
        incomeChange="+5.19%"
        amount="120 000"
        asset="SOL"
        expiration="30.05.2025"
        onClaim={() => alert("Claimed!")}
      />
    </PageContainer>
  );
};

export default Trades;
