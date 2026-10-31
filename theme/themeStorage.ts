import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemePreference = "system" | "light" | "dark";

export const THEME_PREFERENCE_KEY = "storytime.themePreference";

const isPreference = (v: unknown): v is ThemePreference =>
  v === "system" || v === "light" || v === "dark";

export async function loadThemePreference(): Promise<ThemePreference> {
  try {
    const stored = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
    return isPreference(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

export async function saveThemePreference(
  pref: ThemePreference
): Promise<void> {
  try {
    await AsyncStorage.setItem(THEME_PREFERENCE_KEY, pref);
  } catch {
    // Non-fatal: the preference simply won't persist this session.
  }
}
