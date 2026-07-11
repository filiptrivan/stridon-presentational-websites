import { truncateText } from "@brand/shared/lib/og/utils";
import { colors } from "./constants";
import { Logo } from "./logo";

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
      {/* Top-left navy glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          background:
            "radial-gradient(ellipse at 0% -50%, rgba(27,60,143,0.12) 0%, transparent 70%)",
        }}
      />
      {/* Subtle horizontal lines */}
      <svg
        width="1200"
        height="630"
        viewBox="0 0 1200 630"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="lineFade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1b3c8f" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#1b3c8f" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#1b3c8f" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[180, 270, 360, 450, 540].map((y) => (
          <line
            key={y}
            x1={0}
            y1={y}
            x2={1200}
            y2={y}
            stroke="url(#lineFade)"
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
        <Logo size={36} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "auto 0",
          }}
        >
          {/* Navy accent line */}
          <div
            style={{
              width: 48,
              height: 4,
              backgroundColor: colors.primary,
              borderRadius: 2,
              marginBottom: 28,
              display: "flex",
            }}
          />
          <div
            style={{
              display: "flex",
              fontFamily: "Space Grotesk",
              fontSize: 72,
              fontWeight: 700,
              color: colors.foreground,
              lineHeight: 1.15,
              maxWidth: 920,
            }}
          >
            {truncateText(title, 60)}
          </div>
          {description && (
            <div
              style={{
                display: "flex",
                fontFamily: "Inter",
                fontSize: 30,
                color: colors.muted,
                marginTop: 24,
                lineHeight: 1.5,
                maxWidth: 750,
              }}
            >
              {truncateText(description, 120)}
            </div>
          )}
        </div>

        {/* Domain tag bottom-right */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 80,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: colors.primaryBright,
              display: "flex",
            }}
          />
          <span
            style={{
              fontFamily: "Inter",
              fontSize: 20,
              color: colors.muted,
            }}
          >
            stridon.rs
          </span>
        </div>
      </div>
    </OgBackground>
  );
}
