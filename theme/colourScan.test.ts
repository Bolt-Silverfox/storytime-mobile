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

  it("scans multi-line, nested-brace and template colour props", () => {
    const multi =
      '<Icon\n  color={\n    ok\n      ? tokens.link\n      : "#000000"\n  }\n/>';
    expect(rules(multi)).toContain("color-prop");
    expect(rules('<Icon color={f({ a: 1 }) ? "#000" : "#111"} />')).toContain(
      "color-prop"
    );
    expect(rules("<Icon color={`#000`} />")).toContain("color-prop");
    expect(
      rules("<Icon\n color={ok\n ? tokens.link\n : tokens.x}\n/>")
    ).toEqual([]);
  });

  it("reports the line of the multi-line literal", () => {
    const f = scanSource('<Icon\n  color={\n    ok ? a : "#000000"\n  }\n/>');
    expect(f.map((x) => x.line)).toEqual([3]);
  });

  it("match is the exact fragment even for a lone hit", () => {
    const f = scanSource(
      '<View className="bg-white p-2" /> // note: text-red-600'
    );
    const white = f.find((x) => x.rule === "bg-white-class");
    expect(white?.match).toBe("bg-white");
  });

  it("a > inside an attribute string does not end the opening tag", () => {
    const src =
      '<View accessibilityLabel="a > b" className="bg-red-50">\n<Text className="text-danger">b</Text></View>';
    expect(rules(src)).toContain("token-text-inside-fixed-light-bg");
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

  describe("fixed-ink PNG icons (vanish on dark)", () => {
    const img = (extra: string) =>
      `<Image source={require("../../assets/icons/apple-icon.png")} ${extra} />`;

    it("flags an untinted dark-ink asset", () => {
      const f = scanSource(img(""));
      expect(f.map((x) => x.rule)).toContain("untinted-ink-asset");
      expect(f.find((x) => x.rule === "untinted-ink-asset")?.match).toBe(
        "apple-icon.png"
      );
    });

    it("flags tick.png and middot.png on a multi-line Image", () => {
      expect(
        rules(
          '<Image\n source={require("../a/tick.png")}\n className="h-4"\n/>'
        )
      ).toContain("untinted-ink-asset");
      expect(rules('<Image source={require("x/middot.png")} />')).toContain(
        "untinted-ink-asset"
      );
    });

    it("passes when the Image carries a tintColor (style or prop)", () => {
      expect(
        rules(
          img("style={isDark ? { tintColor: tokens.textStrong } : undefined}")
        )
      ).not.toContain("untinted-ink-asset");
      expect(rules(img("tintColor={tokens.link}"))).not.toContain(
        "untinted-ink-asset"
      );
    });

    it("does not flag other assets, and tint on a neighbouring Image does not leak", () => {
      expect(
        rules('<Image source={require("../a/google-icon.png")} />')
      ).toEqual([]);
      const two =
        '<Image source={require("a/tick.png")} />\n<Image source={require("a/b.png")} style={{ tintColor: t }} />';
      expect(rules(two)).toContain("untinted-ink-asset");
      const reversed =
        '<Image source={require("a/b.png")} style={{ tintColor: t }} />\n<Image source={require("a/tick.png")} />';
      expect(rules(reversed)).toContain("untinted-ink-asset");
    });
  });

  describe("text style with no colour (renders default black)", () => {
    const src = (tag: string, entry: string) =>
      `${tag}\nconst s = StyleSheet.create({\n  ${entry}\n});`;

    it("flags <Text style={styles.k}> whose entry sets no colour", () => {
      const f = scanSource(
        src(
          '<Text style={styles.titleText} className="text-center text-[28px]">x</Text>',
          'titleText: {\n    fontFamily: "quilka",\n  },'
        )
      );
      expect(f.map((x) => x.rule)).toContain("text-style-no-colour");
    });

    it("passes when the entry has a colour, spreads a themed style, or className supplies a token colour", () => {
      const tag =
        '<Text style={styles.titleText} className="text-center">x</Text>';
      expect(
        rules(
          src(
            tag,
            'titleText: {\n    fontFamily: "q",\n    color: t.textStrong,\n  },'
          )
        )
      ).not.toContain("text-style-no-colour");
      expect(
        rules(
          src(
            tag,
            'titleText: {\n    ...defaultStyles.heading,\n    fontFamily: "q",\n  },'
          )
        )
      ).not.toContain("text-style-no-colour");
      expect(
        rules(
          src(
            '<Text style={styles.titleText} className="text-fg">x</Text>',
            'titleText: {\n    fontFamily: "q",\n  },'
          )
        )
      ).not.toContain("text-style-no-colour");
    });

    it("ignores styles used on non-Text elements", () => {
      expect(
        rules(
          src(
            "<View style={styles.box}>x</View>",
            'box: {\n    fontFamily: "q",\n  },'
          )
        )
      ).not.toContain("text-style-no-colour");
    });
  });
});
