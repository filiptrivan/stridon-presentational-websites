"use client";

import Container from "./container";
import HeroHeader from "./hero-header";
import { Button } from "@brand/ui/button";
import { Home, RotateCcw } from "lucide-react";
import Link from "next/link";

interface ErrorPageProps {
  title?: string;
  description?: string;
  reset: () => void;
}

const ErrorPage = ({
  title = "Ups, nešto nije u redu",
  description = "Došlo je do greške prilikom učitavanja podataka. Probaj ponovo ili se vrati na početnu stranu.",
  reset,
}: ErrorPageProps) => {
  return (
    <HeroHeader title={title} description={description}>
      <Container delay={0.3}>
        <div className="flex items-center gap-3 mt-6">
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="size-4" />
            Probaj ponovo
          </Button>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <Home className="size-4" />
              Početna
            </Button>
          </Link>
        </div>
      </Container>
    </HeroHeader>
  );
};

export default ErrorPage;
