import { colors, fontFamilies } from "./constants";

export function Logo({ width = 200 }: { width?: number }) {
  // Placeholder until real DCK logo SVG is added
  const height = Math.round(width * 0.35);

  return (
    <span
      style={{
        fontSize: height,
        fontWeight: 600,
        fontFamily: fontFamilies.heading,
        color: colors.primary,
        display: "flex",
        letterSpacing: 2,
      }}
    >
      DCK
    </span>
  );
}
