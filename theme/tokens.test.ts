import { contrastRatio as contrast } from "./contrast";
import { darkTokens, lightTokens, TokenName } from "./tokens";

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
    ["textSubtle", "background"],
    ["textSubtle", "surface"],
    ["textFaint", "background"],
    ["textFaint", "surface"],
    ["brandText", "background"],
    ["brandText", "surface"],
    ["brandText", "tint"],
    ["danger", "background"],
    ["danger", "surface"],
    ["errorText", "surface"],
    ["link", "background"],
    ["link", "surface"],
    ["purple", "background"],
    ["purple", "surface"],
    ["readerHighlightText", "readerHighlight"],
    ["textStrong", "readerPanel"],
  ];
  it.each(text)("dark %s on %s meets WCAG AA 4.5:1", (fg, bg) => {
    expect(contrast(darkTokens[fg], darkTokens[bg])).toBeGreaterThanOrEqual(
      4.5
    );
  });

  const ui: Array<[TokenName, TokenName]> = [
    ["border", "background"],
    ["border", "surface"],
    ["borderInput", "background"],
    ["borderInput", "surface"],
    ["readerPanelBorder", "background"],
  ];
  it.each(ui)("dark %s on %s meets 3:1 for UI components", (fg, bg) => {
    expect(contrast(darkTokens[fg], darkTokens[bg])).toBeGreaterThanOrEqual(3);
  });
});
