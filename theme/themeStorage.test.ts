import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  THEME_PREFERENCE_KEY,
  loadThemePreference,
  saveThemePreference,
} from "./themeStorage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn().mockResolvedValue(undefined),
}));

const getItem = AsyncStorage.getItem as jest.Mock;

describe("themeStorage", () => {
  beforeEach(() => jest.clearAllMocks());

  it("defaults to system when nothing is stored", async () => {
    getItem.mockResolvedValue(null);
    await expect(loadThemePreference()).resolves.toBe("system");
  });

  it.each(["light", "dark", "system"])("returns stored %s", async (v) => {
    getItem.mockResolvedValue(v);
    await expect(loadThemePreference()).resolves.toBe(v);
  });

  it("falls back to system for garbage or storage errors", async () => {
    getItem.mockResolvedValue("neon");
    await expect(loadThemePreference()).resolves.toBe("system");
    getItem.mockRejectedValue(new Error("boom"));
    await expect(loadThemePreference()).resolves.toBe("system");
  });

  it("persists the preference", async () => {
    await saveThemePreference("dark");
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      THEME_PREFERENCE_KEY,
      "dark"
    );
  });
});
