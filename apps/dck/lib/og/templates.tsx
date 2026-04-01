import { colors } from "./constants";
import { Logo } from "./logo";
import { formatPrice, truncateText } from "@brand/shared/lib/og/utils";

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
          background:
            "radial-gradient(ellipse at 0% -50%, rgba(227,30,36,0.15) 0%, transparent 75%)",
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

function AccentLine() {
  return (
    <div
      style={{
        width: "100%",
        height: 1,
        display: "flex",
        background: `linear-gradient(to right, ${colors.background}, rgba(227,30,36,0.5), ${colors.background})`,
      }}
    />
  );
}

// NOTE: OgFooter is intentionally NOT used on most templates.
// The dcksrbija.rs URL is redundant — recipients already see the domain in the shared link.
function OgFooter() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 80,
        right: 80,
        display: "flex",
        flexDirection: "column",
        paddingBottom: 36,
      }}
    >
      <AccentLine />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 20,
        }}
      >
        <Logo width={110} />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
              fontSize: 18,
              color: colors.muted,
            }}
          >
            dcksrbija.rs
          </span>
        </div>
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
              fontFamily: "Space Grotesk",
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
                fontFamily: "Inter",
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

//#region ProductTemplate

export function ProductTemplate({
  title,
  displayPrice,
  originalPrice,
  hasDiscount,
  discountPercentage,
  imageUrl,
}: {
  title: string;
  displayPrice: number;
  originalPrice?: number | null;
  hasDiscount: boolean;
  discountPercentage?: number | null;
  imageUrl?: string;
}) {
  const formattedPrice = formatPrice(displayPrice);
  const formattedOriginal = originalPrice ? formatPrice(originalPrice) : null;
  const truncatedTitle = truncateText(title, 80);

  return (
    <OgBackground>
      {/* Logo top-left */}
      <div
        style={{
          display: "flex",
          padding: "60px 60px 0 60px",
        }}
      >
        <Logo width={220} />
      </div>

      <div
        style={{
          width: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 60px 60px 60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 50,
          }}
        >
          {/* Left side: product image */}
          {imageUrl && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                width: 450,
                height: 450,
                flexShrink: 0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt=""
                width={450}
                height={450}
                style={{ objectFit: "contain" }}
              />
            </div>
          )}

          {/* Right side: text content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              paddingTop: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                fontFamily: "Space Grotesk",
                fontSize: truncatedTitle.length > 40 ? 44 : 52,
                color: colors.foreground,
                marginBottom: 24,
                lineHeight: 1.2,
              }}
            >
              {truncatedTitle}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontFamily: "Space Grotesk",
                  fontSize: 52,
                  color: colors.primaryBright,
                }}
              >
                {formattedPrice}
              </div>
              {hasDiscount && discountPercentage != null && (
                <div
                  style={{
                    display: "flex",
                    fontFamily: "Space Grotesk",
                    fontSize: 24,
                    fontWeight: 600,
                    color: "#ffffff",
                    backgroundColor: colors.primaryBright,
                    padding: "6px 18px",
                    borderRadius: 6,
                  }}
                >
                  -{discountPercentage}%
                </div>
              )}
            </div>
            {hasDiscount && formattedOriginal && (
              <div
                style={{
                  display: "flex",
                  fontFamily: "Inter",
                  fontSize: 28,
                  color: colors.muted,
                  textDecoration: "line-through",
                  marginTop: 6,
                }}
              >
                {formattedOriginal}
              </div>
            )}
          </div>
        </div>
      </div>
    </OgBackground>
  );
}

//#endregion

//#region CategoryTemplate

export function CategoryTemplate({
  name,
  description,
}: {
  name: string;
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
          justifyContent: "center",
          padding: "60px 80px",
        }}
      >
        {/* "KATEGORIJA" label with accent line prefix */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 32,
              height: 2,
              backgroundColor: colors.primaryBright,
              display: "flex",
            }}
          />
          <div
            style={{
              display: "flex",
              fontFamily: "Inter",
              fontSize: 22,
              color: colors.primaryBright,
              letterSpacing: 3,
            }}
          >
            KATEGORIJA
          </div>
        </div>

        {/* Category name */}
        <div
          style={{
            display: "flex",
            fontFamily: "Space Grotesk",
            fontSize: 72,
            color: colors.foreground,
            lineHeight: 1.2,
            maxWidth: 800,
          }}
        >
          {truncateText(name, 60)}
        </div>

        {description && (
          <div
            style={{
              display: "flex",
              fontFamily: "Inter",
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

        {/* Concentric ring outlines on right side */}
        <div
          style={{
            position: "absolute",
            top: 120,
            right: 80,
            width: 300,
            height: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {[280, 210, 140, 80].map((size) => (
            <div
              key={size}
              style={{
                position: "absolute",
                width: size,
                height: size,
                borderRadius: size / 2,
                border: `1px solid rgba(227,30,36,${size === 280 ? 0.2 : size === 210 ? 0.15 : size === 140 ? 0.1 : 0.07})`,
                display: "flex",
              }}
            />
          ))}
        </div>

        {/* Dot grid in bottom-right */}
        <div
          style={{
            position: "absolute",
            bottom: 100,
            right: 80,
            display: "flex",
            flexWrap: "wrap",
            width: 120,
            gap: 20,
          }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 3,
                height: 3,
                borderRadius: 2,
                backgroundColor: "rgba(227,30,36,0.25)",
                display: "flex",
              }}
            />
          ))}
        </div>
      </div>
      <OgFooter />
    </OgBackground>
  );
}

//#endregion
