import { Appearance } from "react-native";
import { Text } from "react-native";
import TestRenderer, { act } from "react-test-renderer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider, useTheme } from "./ThemeContext";
import { tokensToCssVars } from "./cssVars";
import { darkTokens, lightTokens } from "./tokens";
import { legacyLight } from "./legacyPalette";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn().mockResolvedValue(undefined),
}));

let mockSystemScheme: "light" | "dark" = "light";
jest.mock("react-native/Libraries/Utilities/useColorScheme", () => ({
  __esModule: true,
  default: () => mockSystemScheme,
}));

const Probe = () => {
  const { scheme, preference, ready, setPreference } = useTheme();
  return (
    <>
      <Text testID="out">{`${scheme}|${preference}|${ready}`}</Text>
      <Text testID="dark" onPress={() => setPreference("dark")} />
    </>
  );
};

const setItem = AsyncStorage.setItem as jest.Mock;
const getItem = AsyncStorage.getItem as jest.Mock;

describe("light palette is unchanged", () => {
  it.each(Object.entries(legacyLight))("%s", (name, value) => {
    expect((lightTokens as Record<string, string>)[name]).toBe(value);
  });
});

describe("tokensToCssVars", () => {
  it("covers every hex token in both schemes with identical keys", () => {
    expect(Object.keys(tokensToCssVars(darkTokens)).sort()).toEqual(
      Object.keys(tokensToCssVars(lightTokens)).sort()
    );
  });
});

const flush = () => act(async () => {});
const mount = async () => {
  let r!: ReturnType<typeof TestRenderer.create>;
  await act(async () => {
    r = TestRenderer.create(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );
  });
  await flush();
  return r;
};
const out = (r: ReturnType<typeof TestRenderer.create>) =>
  r.root.findByProps({ testID: "out" }).props.children;

describe("ThemeProvider", () => {
  let setScheme: jest.SpyInstance;
  beforeEach(() => {
    jest.clearAllMocks();
    mockSystemScheme = "light";
    setScheme = jest.spyOn(Appearance, "setColorScheme").mockImplementation();
  });

  it("follows the system scheme by default and maps system to 'unspecified'", async () => {
    getItem.mockResolvedValue(null);
    mockSystemScheme = "dark";
    const r = await mount();
    expect(out(r)).toBe("dark|system|true");
    expect(setScheme).toHaveBeenLastCalledWith("unspecified");
  });

  it("applies a stored override and sets the native scheme", async () => {
    getItem.mockResolvedValue("dark");
    const r = await mount();
    expect(out(r)).toBe("dark|dark|true");
    expect(setScheme).toHaveBeenLastCalledWith("dark");
  });

  it("persists a user choice and does not let a late storage read overwrite it", async () => {
    let resolve: (v: string | null) => void = () => {};
    getItem.mockReturnValue(new Promise((r) => (resolve = r)));
    const r = await mount();
    expect(out(r)).toBe("light|system|false");
    act(() => r.root.findByProps({ testID: "dark" }).props.onPress());
    expect(setItem).toHaveBeenCalledWith("storytime.themePreference", "dark");
    await act(async () => resolve("light"));
    await flush();
    expect(out(r)).toBe("dark|dark|true");
  });
});
