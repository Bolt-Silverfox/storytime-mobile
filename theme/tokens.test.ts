import { darkTokens, lightTokens, TokenName } from "./tokens";

const channel = (v: number) => {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};
const luminance = (hex: string) => {
  const n = parseInt(hex.slice(1, 7), 16);
  return (
    0.2126 * channel((n >> 16) & 255) +
    0.7152 * channel((n >> 8) & 255) +
    0.0722 * channel(n & 255)
  );
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

describe("theme tokens", () => {
  it("light and dark expose the same token names", () => {
    expect(Object.keys(darkTokens).sort()).toEqual(
      Object.keys(lightTokens).sort()
    );
  });

  it("light values are unchanged from the pre-dark-mode palette", () => {
    expect(lightTokens.background).toBe("#fbf8f7");
    expect(lightTokens.surface).toBe("#FFFFFF");
    expect(lightTokens.textStrong).toBe("#212121");
    expect(lightTokens.textBody).toBe("#616161");
    expect(lightTokens.border).toBe("#4A413F");
    expect(lightTokens.borderLight).toBe("#E0E0E0");
    expect(lightTokens.brand).toBe("#EC4007");
    expect(lightTokens.link).toBe("#0731EC");
  });

  const text: Array<[TokenName, TokenName]> = [
    ["textStrong", "background"],
    ["textStrong", "surface"],
    ["textStrong", "surfaceCream"],
    ["textStrong", "tint"],
    ["textBody", "background"],
    ["textBody", "surface"],
    ["textBody", "surfaceCream"],
    ["textBody", "tint"],
    ["textMuted", "background"],
    ["textMuted", "surface"],
    ["brandText", "background"],
    ["brandText", "surface"],
    ["brandText", "tint"],
    ["link", "background"],
    ["link", "surface"],
    ["purple", "background"],
    ["purple", "surface"],
    ["readerHighlightText", "readerHighlight"],
    ["textStrong", "readerPanel"],
  ];
  it.each(text)("dark %s on %s meets WCAG AA 4.5:1", (fg, bg) => {
    expect(contrast(darkTokens[fg], darkTokens[bg])).toBeGreaterThanOrEqual(4.5);
  });

  const ui: Array<[TokenName, TokenName]> = [
    ["border", "background"],
    ["border", "surface"],
    ["readerPanelBorder", "background"],
  ];
  it.each(ui)("dark %s on %s meets 3:1 for UI components", (fg, bg) => {
    expect(contrast(darkTokens[fg], darkTokens[bg])).toBeGreaterThanOrEqual(3);
  });
});
