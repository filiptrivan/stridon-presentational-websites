import type { StatsProps } from "./stats";
import Stats from "./stats";

function CompanyStats({ stats, layout }: StatsProps) {
  return <Stats stats={stats} layout={layout} />;
}

export default CompanyStats;
