"use client";

import Container from "./container";
import HeroHeader from "./hero-header";
import { Button } from "@brand/ui/button";
import { Home, RotateCcw } from "lucide-react";
import Link from "next/link";

const DEFAULT_LABELS = {
  title: "Ups, nešto nije u redu",
  description:
    "Došlo je do greške prilikom učitavanja podataka. Probaj ponovo ili se vrati na početnu stranu.",
  retry: "Probaj ponovo",
  home: "Početna",
};

export type ErrorPageLabels = Partial<typeof DEFAULT_LABELS>;

interface ErrorPageProps {
  /** Kept for the two callers that already pass them individually. */
  title?: string;
  description?: string;
  labels?: ErrorPageLabels;
  homeHref?: string;
  reset: () => void;
}

const ErrorPage = ({
  title,
  description,
  labels,
  homeHref = "/",
  reset,
}: ErrorPageProps) => {
  const t = { ...DEFAULT_LABELS, ...labels };
  return (
    <HeroHeader
      title={title ?? t.title}
      description={description ?? t.description}
    >
      <Container delay={0.3}>
        <div className="flex items-center gap-3 mt-6">
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="size-4" />
            {t.retry}
          </Button>
          <Link href={homeHref}>
            <Button variant="ghost" size="sm">
              <Home className="size-4" />
              {t.home}
            </Button>
          </Link>
        </div>
      </Container>
    </HeroHeader>
  );
};

export default ErrorPage;
