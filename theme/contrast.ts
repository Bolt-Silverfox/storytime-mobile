const toRgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1, 7), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const toHex = (rgb: number[]) =>
  `#${rgb.map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;
const channel = (v: number) => {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};

export const luminance = (hex: string) => {
  const [r, g, b] = toRgb(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

export const contrastRatio = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** Mix `fg` over `bg` at `alpha` (0..1). */
export const blend = (fg: string, bg: string, alpha: number) => {
  const f = toRgb(fg);
  const b = toRgb(bg);
  return toHex(f.map((c, i) => c * alpha + b[i] * (1 - alpha)));
};

/**
 * Lighten `colour` toward white until it reaches `min` contrast on
 * `surface` tinted with 20% of the colour (the category chip look).
 */
export const readableOnTint = (
  colour: string,
  surface: string,
  min = 4.5
): string => {
  const tinted = blend(colour, surface, 0.2);
  for (let t = 0; t <= 1.0001; t += 0.05) {
    const out = blend("#FFFFFF", colour, t);
    if (contrastRatio(out, tinted) >= min) return out;
  }
  return "#FFFFFF";
};
