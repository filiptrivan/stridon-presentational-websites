import Container from "@brand/shared/components/container";
import Wrapper from "@brand/shared/components/wrapper";
import { cn } from "@brand/shared/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: ReactNode;
  /** Lede paragraph. Sits in the right column, or under the title when `aside` takes that column. */
  lede?: ReactNode;
  /** Block for the right column (a brand logo tile, for instance). */
  aside?: ReactNode;
  backLink?: { href: string; label: string };
  /** Buttons rendered under the title. */
  children?: ReactNode;
}

// Inner-page header: a shallow tinted band, left aligned, split into an
// asymmetric two-column grid. Deliberately not the homepage hero - no column
// grid backdrop, no centering, less vertical air.
const PageHeader = ({
  title,
  lede,
  aside,
  backLink,
  children,
}: PageHeaderProps) => {
  return (
    <header className="border-b border-border bg-muted/30">
      <Wrapper className="py-12 lg:py-16">
        {backLink ? (
          <Container>
            <Link
              href={backLink.href}
              className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
              {backLink.label}
            </Link>
          </Container>
        ) : null}

        <div
          className={cn(
            "grid gap-8",
            aside
              ? "lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16"
              : "lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-end lg:gap-16",
          )}
        >
          <Container>
            <h1 className="max-w-3xl text-balance text-[clamp(2rem,4.2vw,3.25rem)] font-semibold leading-[1.05] tracking-tight">
              {title}
            </h1>

            {aside && lede ? (
              <p className="mt-4 max-w-xl text-lg text-muted-foreground">
                {lede}
              </p>
            ) : null}

            {children ? (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {children}
              </div>
            ) : null}
          </Container>

          {aside ? (
            <Container delay={0.5}>{aside}</Container>
          ) : lede ? (
            <Container delay={0.5}>
              <p className="text-muted-foreground lg:border-l lg:border-border lg:pb-1 lg:pl-10">
                {lede}
              </p>
            </Container>
          ) : null}
        </div>
      </Wrapper>
    </header>
  );
};

export default PageHeader;
