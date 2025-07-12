import React from "react";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import StrategyCard from "../components/StrategyCard";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStores } from "../stores/useStores";
import type { Strategy } from "../services/api";

const Strategies: React.FC = observer(() => {
  const navigate = useNavigate();
  const { strategiesStore } = useStores();
  return (
    <PageContainer>
      <PageTitle>Select your strategy</PageTitle>
      {strategiesStore.strategies.map((strategy: Strategy) => (
        <StrategyCard key={strategy.id} strategy={strategy} />
      ))}
    </PageContainer>
  );
});

export default Strategies;
