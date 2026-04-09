"use client";

import { cn } from "@brand/shared/lib/utils";
import { Prose } from "@brand/ui/prose";
import { useState } from "react";
import SectionHeader from "../section-header";

const tabs = [
  { key: "description", label: "Detalji" },
  { key: "specification", label: "Specifikacija" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

interface ProductTabsProps {
  htmlDescription: string | null;
  specification: string | null;
}

const ProductTabs = ({ htmlDescription, specification }: ProductTabsProps) => {
  const contentMap: Record<TabKey, string | null> = {
    description: htmlDescription,
    specification,
  };

  const availableTabs = tabs.filter((tab) => contentMap[tab.key]);
  const [activeTab, setActiveTab] = useState<TabKey>(
    availableTabs[0]?.key ?? "description",
  );

  if (availableTabs.length === 0) return null;

  // Only one section - render without tabs
  if (availableTabs.length === 1) {
    const tab = availableTabs[0];

    return (
      <div>
        <SectionHeader title={tab.label} size="sub" />
        <Prose
          variant="product"
          dangerouslySetInnerHTML={{ __html: contentMap[tab.key]! }}
        />
      </div>
    );
  }

  // Both sections - render with tabs
  return (
    <div>
      <div className="flex border-b border-border/20 mb-6">
        {availableTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Prose
        variant="product"
        dangerouslySetInnerHTML={{ __html: contentMap[activeTab]! }}
      />
    </div>
  );
};

export default ProductTabs;
