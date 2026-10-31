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

  it("flags any non-safe hex colour prop, focusColor and widened shapes", () => {
    expect(rules('<Spinner color="#4807EC" />')).toContain("color-prop");
    expect(rules('<Otp focusColor="blue" />')).toContain("color-prop");
    expect(rules('<Icon color="#EC4007" />')).toEqual([]);
    expect(rules('backgroundColor: "#FFF9C4"')).toContain(
      "light-background-style"
    );
    expect(
      rules(
        '<View className="bg-blue-100"><Text className="text-surface">x</Text></View>'
      )
    ).toContain("token-text-inside-fixed-light-bg");
  });

  it("ignores a fixed-bg string in code after a COMPLETE opening tag (repro 1)", () => {
    const src =
      '<View style={{}}>\n const [c] = useState("bg-red-50");\n<Text className="text-danger">b</Text></View>';
    expect(rules(src)).not.toContain("token-text-inside-fixed-light-bg");
  });

  it("ignores a fixed-bg string inside a .map callback (repro 2)", () => {
    const src = [
      "<View>",
      "  {items.map((i) => {",
      '    const c = i.ok ? "bg-red-50" : "x";',
      '    return <Text className="text-danger">{i}</Text>;',
      "  })}",
      "</View>",
    ].join("\n");
    expect(rules(src)).not.toContain("token-text-inside-fixed-light-bg");
  });

  it("still flags a fixed bg on a multi-line opening tag", () => {
    const src =
      '<View\n  accessibilityLabel="x"\n  className="bg-red-50 p-2"\n>\n<Text className="text-danger">b</Text></View>';
    expect(rules(src)).toContain("token-text-inside-fixed-light-bg");
  });

  it("reports every colour on one line, not just the first", () => {
    const n = (src: string) =>
      scanSource(src).filter((f) => f.rule === "color-prop").length;
    expect(n('<Icon color="#fff" /><Icon color="#000" />')).toBe(1);
    expect(n('<A color="#4807EC" /><B color="#000" />')).toBe(2);
  });

  it("reports every hit of a line rule, keyed by fragment", () => {
    const hits = scanSource(
      '<Text className="text-red-600 text-green-700">x</Text>'
    ).filter((f) => f.rule === "text-palette-class");
    expect(hits.map((h) => h.match)).toEqual([
      "text-red-600",
      "text-green-700",
    ]);
  });

  it("flags unsafe literals inside color={...} ternaries", () => {
    expect(rules('<Icon color={isDark ? "#fff" : "#4807EC"} />')).toContain(
      "color-prop"
    );
    expect(rules('<Icon color={ok ? "red" : tokens.x} />')).toContain(
      "color-prop"
    );
    expect(rules('<Icon color={isDark ? tokens.link : "blue"} />')).toContain(
      "color-prop"
    );
    expect(rules('<Icon color={isDark ? "#fff" : "#EC4007"} />')).toEqual([]);
    expect(rules("<Icon color={tokens.textStrong} />")).toEqual([]);
  });

  it("ignores fixed-bg class strings that are not on an opening tag", () => {
    expect(
      rules(
        '<View className="x"><Text>a</Text></View>;\nconst [c] = useState("bg-red-50");\n<Text className="text-danger">b</Text>'
      )
    ).toEqual([]);
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
