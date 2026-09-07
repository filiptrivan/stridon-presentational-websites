import { truncateText } from "@brand/shared/lib/og/utils";
import { colors, fontFamilies, primaryRgb } from "./constants";
import { Logo } from "./logo";

//#region Shared Components

function OgBackground({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        backgroundColor: colors.background,
      }}
    >
      {/* Bold top glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          background: `radial-gradient(ellipse at 0% -50%, rgba(${primaryRgb},0.15) 0%, transparent 75%)`,
        }}
      />
      {/* Vertical grid lines */}
      <svg
        width="1200"
        height="630"
        viewBox="0 0 1200 630"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="black" stopOpacity="0.06" />
            <stop offset="100%" stopColor="black" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 240, 480, 720, 960, 1199].map((x) => (
          <line
            key={x}
            x1={x}
            y1={0}
            x2={x}
            y2={630}
            stroke="url(#gridFade)"
            strokeWidth={1}
          />
        ))}
      </svg>
      {/* Content */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>
    </div>
  );
}

//#endregion

//#region DefaultTemplate

export function DefaultTemplate({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <OgBackground>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "60px 80px",
        }}
      >
        {/* Logo top-left as brand mark */}
        <Logo width={140} />

        {/* Title & description left-aligned */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "auto 0",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: fontFamilies.heading,
              fontSize: 72,
              color: colors.foreground,
              lineHeight: 1.2,
              maxWidth: 900,
            }}
          >
            {truncateText(title, 60)}
          </div>
          {description && (
            <div
              style={{
                display: "flex",
                fontFamily: fontFamilies.body,
                fontSize: 30,
                color: colors.muted,
                marginTop: 20,
                lineHeight: 1.5,
                maxWidth: 750,
              }}
            >
              {truncateText(description, 120)}
            </div>
          )}
        </div>
      </div>
    </OgBackground>
  );
}

//#endregion
