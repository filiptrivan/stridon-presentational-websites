export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1).trimEnd() + "…";
}

export function formatPrice(price: number): string {
  return `${Math.round(price).toLocaleString("sr-RS")} RSD`;
}
