import React from "react";
import chartDownIcon from "../assets/icons/chartDown.svg";
import chartUpIcon from "../assets/icons/chartUp.svg";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import StrategyCard from "../components/StrategyCard";

const Strategies: React.FC = () => {
  return (
    <PageContainer>
      <PageTitle>Select your strategy</PageTitle>
      <StrategyCard
        title="Strategy 1"
        status="in progress"
        yieldPercent="6%"
        amount="120 000"
        asset="BTC"
        expiration="05.06.2025"
        onInvest={() => alert("Invest")}
        chartSrc={chartUpIcon}
      />
      <StrategyCard
        title="Strategy 2"
        status="in progress"
        yieldPercent="6%"
        amount="120 000"
        asset="BTC"
        expiration="05.06.2025"
        onInvest={() => alert("Invest")}
        chartSrc={chartDownIcon}
      />
    </PageContainer>
  );
};

export default Strategies;
