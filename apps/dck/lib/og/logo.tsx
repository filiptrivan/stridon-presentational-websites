export function Logo({ width = 200 }: { width?: number }) {
  // Placeholder until real DCK logo SVG is added
  const height = Math.round(width * 0.35);

  return (
    <span
      style={{
        fontSize: height,
        fontWeight: 700,
        fontFamily: "Space Grotesk",
        color: "#E31E24",
        display: "flex",
        letterSpacing: 2,
      }}
    >
      DCK
    </span>
  );
}
