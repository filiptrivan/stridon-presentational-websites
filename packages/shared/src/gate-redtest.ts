import { cookies } from "next/headers";

// Deliberate cacheComponents dynamic-IO violation for gate validation:
// runtime API read inside a "use cache" scope.
export async function gateRedTest() {
  "use cache";
  const store = await cookies();
  return store.get("x")?.value ?? null;
}
