import { AlertCircle } from "lucide-react";

interface SectionErrorProps {
  message?: string;
}

export function SectionError({
  message = "Došlo je do greške prilikom učitavanja.",
}: SectionErrorProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
      <AlertCircle className="h-5 w-5" />
      <span>{message}</span>
    </div>
  );
}
