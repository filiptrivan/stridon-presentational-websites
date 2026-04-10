import { BASE_BREADCRUMBS, type BreadcrumbSegment } from "@brand/shared/lib/categories";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@brand/ui/breadcrumb";
import { cn } from "@brand/shared/lib/utils";
import { Fragment } from "react";
import Link from "next/link";

interface PageBreadcrumbsProps {
  items: BreadcrumbSegment[];
  className?: string;
}

const PageBreadcrumbs = ({ items, className }: PageBreadcrumbsProps) => {
  const allCrumbs = [...BASE_BREADCRUMBS, ...items];

  return (
    <Breadcrumb className={cn("mb-8", className)}>
      <BreadcrumbList>
        {allCrumbs.map((crumb, index) => {
          const isLast = index === allCrumbs.length - 1;

          return (
            <Fragment key={crumb.href}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default PageBreadcrumbs;
