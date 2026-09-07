import { CLIENT_LOGOS } from "@/constants/about";
import Container from "@brand/shared/components/container";
import Wrapper from "@brand/shared/components/wrapper";
import Image from "next/image";

const Clients = () => {
  return (
    <section className="border-b border-border">
      <Wrapper className="py-14 lg:py-20">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-xl text-2xl font-semibold tracking-tight lg:text-3xl">
              Ko su naši klijenti
            </h2>
            <p className="max-w-md text-muted-foreground">
              Renomirane domaće firme iz građevine, stolarstva, keramike i
              drugih oblasti, mala i srednja preduzeća, ali i majstori koji rade
              sami.
            </p>
          </div>
        </Container>

        <Container delay={0.5}>
          <div className="mt-10 grid grid-cols-2 border-l border-t border-border sm:grid-cols-3 lg:grid-cols-4">
            {CLIENT_LOGOS.map((logo) => (
              <div
                key={logo.src}
                className="relative flex aspect-[2/1] items-center justify-center border-b border-r border-border p-6 lg:p-8"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={250}
                  height={125}
                  // The image optimizer rejects SVG unless dangerouslyAllowSVG is on.
                  unoptimized
                  className="max-h-full w-auto max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        </Container>
      </Wrapper>
    </section>
  );
};

export default Clients;
