import React from "react";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import StrategyCard from "../components/StrategyCard";
import { observer } from "mobx-react-lite";
import { useStores } from "../stores/useStores";
import Loading from "../components/Loading";

const Strategies: React.FC = observer(() => {
  const { strategiesStore } = useStores();
  if (!strategiesStore.initialized) return <Loading />;
  return (
    <PageContainer>
      <PageTitle>Select your strategy</PageTitle>
      {strategiesStore.strategies.map((strategy) => (
        <StrategyCard key={strategy.id} strategy={strategy} />
      ))}
    </PageContainer>
  );
});

export default Strategies;
