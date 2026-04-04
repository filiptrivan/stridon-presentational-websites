import { ReactNode } from "react";
import Container from "./container";

interface HeroBadgesProps {
  heading: string;
  children: ReactNode;
}

function HeroBadges({ heading, children }: HeroBadgesProps) {
  return (
    <Container>
      <div className="mb-5 sm:mb-6 flex flex-col items-center justify-center gap-2">
        <p className="text-xs lg:text-sm text-muted-foreground">{heading}</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {children}
        </div>
      </div>
    </Container>
  );
}

export default HeroBadges;
