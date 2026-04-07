import type { StatsProps } from "./stats";
import Stats from "./stats";

function CompanyStats({ stats }: StatsProps) {
  return <Stats stats={stats} />;
}

export default CompanyStats;
