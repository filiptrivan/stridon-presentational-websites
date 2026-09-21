import type { StatsProps } from "./stats";
import Stats from "./stats";

function CompanyStats({ stats, layout, locale }: StatsProps) {
  return <Stats stats={stats} layout={layout} locale={locale} />;
}

export default CompanyStats;
