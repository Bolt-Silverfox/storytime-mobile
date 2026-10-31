/** @jest-environment node */
import { scanSource } from "./colourScan";

const rules = (s: string) => scanSource(s).map((f) => f.rule);

describe("colour scanner", () => {
  it.each([
    ['<Icon color="black" />', "color-prop"],
    ["<Icon color='black' />", "color-prop"],
    ['<Icon color={"black"} />', "color-prop"],
    ['<Icon color="#000000" />', "color-prop"],
    ["style={{ color: 'black' }}", "color-style"],
    ['<Text className="text-black">', "text-palette-class"],
    ['<Text className="text-red-600">', "text-palette-class"],
    ['<Text className="text-gray-500">', "text-palette-class"],
    ['<Text className="text-[#333333]">', "text-hex-class"],
    ['<View className="bg-white/90">', "bg-white-class"],
    ['<View className="bg-white">', "bg-white-class"],
    ['<View className="bg-[#FFFFFF]">', "bg-white-hex-class"],
    ['<View className="bg-black">', "bg-black-class"],
    ['<View className="border-[#212121]">', "border-hex-class"],
    ['<View className="border-black">', "border-black-class"],
    ['backgroundColor: "white"', "light-background-style"],
    ['borderColor: "rgba(0,0,0,0.2)"', "rgb-literal"],
    [
      '<View className="bg-red-50"><Text className="text-red-600">x</Text></View>',
      "text-palette-class",
    ],
    [
      '<View className="bg-red-50"><Text className="text-danger">x</Text></View>',
      "token-text-inside-fixed-light-bg",
    ],
    [
      '<View className="bg-green-50">\n<View><Text className={`a ${ok ? "text-success" : "b"}`}>x</Text></View>\n</View>',
      "token-text-inside-fixed-light-bg",
    ],
    [
      '<View className="bg-red-50 text-danger">',
      "token-text-on-fixed-light-bg",
    ],
    [
      'className={`rounded bg-green-50 ${ok ? "text-success" : "x"}`}',
      "token-text-on-fixed-light-bg",
    ],
    ['<View className="bg-[#FDF5D3] text-fg">', "token-text-on-fixed-light-bg"],
  ])("%s", (src, rule) => {
    if (rule) expect(rules(src)).toContain(rule);
    else expect(rules(src)).toEqual([]);
  });

  it("does not flag token text outside the fixed-bg element", () => {
    expect(
      rules(
        '<View className="bg-red-50"><Text className="x">a</Text></View><Text className="text-danger">b</Text>'
      )
    ).toEqual([]);
  });

  it("does not flag themed usage or translucent overlays", () => {
    expect(
      rules(
        '<View className="bg-surface text-fg border-line bg-black/40 text-white"><Icon color="white" /></View>'
      )
    ).toEqual([]);
  });
});
