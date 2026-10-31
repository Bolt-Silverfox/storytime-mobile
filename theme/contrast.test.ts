import { blend, contrastRatio, readableOnTint } from "./contrast";
import { darkTokens } from "./tokens";

const CATEGORY_COLOURS = [
  "#008D81",
  "#0A2DBA",
  "#5B007C",
  "#926903",
  "#925403",
  "#6F9A0C",
  "#039222",
  "#0C85B8",
  "#EF12A7",
  "#C9240B",
];

describe("contrast helpers", () => {
  it("computes known ratios", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 0);
  });

  it.each(CATEGORY_COLOURS)(
    "dark category colour %s is AA on its 20%% tint",
    (colour) => {
      const text = readableOnTint(colour, darkTokens.background);
      const tint = blend(colour, darkTokens.background, 0.2);
      expect(contrastRatio(text, tint)).toBeGreaterThanOrEqual(4.5);
    }
  );
});
