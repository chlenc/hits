import { observer } from "mobx-react-lite";
import React from "react";
import StrategyCard from "../components/StrategyCard";
import Loading from "../components/Loading";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import { useStores } from "../stores/useStores";

const Strategies: React.FC = observer(() => {
  const { strategiesStore } = useStores();
  if (!strategiesStore.initialized) return <Loading />;

  return (
    <PageContainer>
      <PageTitle>Select your strategy</PageTitle>
      {strategiesStore.strategies
        .slice()
        .reverse()
        .map((strategy) => (
          <StrategyCard key={strategy.id} strategy={strategy} />
        ))}
    </PageContainer>
  );
});

export default Strategies;
