"use client";

import ErrorPage from "@brand/shared/components/error-page";

export default function CategoriesError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorPage
      title="Greška pri učitavanju"
      description="Došlo je do greške prilikom učitavanja kategorija ili proizvoda. Probaj ponovo ili se vrati na početnu stranu."
      reset={reset}
    />
  );
}
