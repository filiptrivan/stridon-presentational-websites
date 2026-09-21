/**
 * Reading a figure back out of an already formatted string.
 *
 * The count-up on the stats band needs a number, but what it is handed is the
 * display string a copywriter wrote: "10.630+", "5.500+", "1995", "100+". That
 * only works while everyone agrees on the separator, and the moment a second
 * language shows up they do not: Serbian groups thousands with a dot and
 * English with a comma, so a parser that only knows about dots reads "10,630+"
 * as 10 and leaves ",630+" sitting there as a suffix. The counter then finishes
 * instantly and the rest of the number never moves, which is how this was
 * noticed.
 */

/** The thousands separator a locale writes, e.g. "." for sr, "," for en. */
export function groupSeparatorFor(locale: string): string {
  return (
    new Intl.NumberFormat(locale)
      .formatToParts(11111)
      .find((part) => part.type === "group")?.value ?? ""
  );
}

export interface ParsedStatValue {
  /** The number to count up to. */
  target: number;
  /** Whatever followed it, e.g. "+" or " m²". */
  suffix: string;
  /** Whether the figure was written grouped, so the count-up should group too. */
  grouped: boolean;
}

const REGEXP_SPECIALS = /[.*+?^${}()|[\]\\]/g;

/**
 * Returns `null` when the value does not start with a number, which is the
 * caller's signal to render it verbatim rather than animate it.
 */
export function parseStatValue(
  value: string,
  groupSeparator: string,
): ParsedStatValue | null {
  const escaped = groupSeparator.replace(REGEXP_SPECIALS, "\\$&");
  const match = value.match(new RegExp(`^([\\d${escaped}]+)(.*)$`));
  if (!match) return null;

  const [, numericPart, suffix] = match;
  const digits =
    groupSeparator === ""
      ? numericPart
      : numericPart.split(groupSeparator).join("");

  return {
    target: Number(digits) || 0,
    suffix,
    // Only group a figure that was written grouped: "1995" is a year on the dck
    // site and must not count up to "1.995".
    grouped: groupSeparator !== "" && numericPart.includes(groupSeparator),
  };
}
