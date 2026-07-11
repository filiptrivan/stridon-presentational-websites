import { colors } from "./constants";

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 6,
          backgroundColor: colors.primary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: "Space Grotesk",
            fontSize: size * 0.55,
            fontWeight: 700,
            color: "#ffffff",
            display: "flex",
          }}
        >
          S
        </div>
      </div>
      <div
        style={{
          fontFamily: "Space Grotesk",
          fontSize: size * 0.75,
          fontWeight: 600,
          color: colors.foreground,
          display: "flex",
        }}
      >
        Stridon Group
      </div>
    </div>
  );
}
