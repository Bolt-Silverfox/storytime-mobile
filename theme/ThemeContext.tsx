import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Appearance,
  ImageStyle,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
  useColorScheme,
} from "react-native";
import { vars } from "nativewind";
import {
  ThemePreference,
  loadThemePreference,
  saveThemePreference,
} from "./themeStorage";
import { darkTokens, lightTokens, Tokens } from "./tokens";

type Scheme = "light" | "dark";

type ThemeContextValue = {
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
  scheme: Scheme;
  isDark: boolean;
  tokens: Tokens;
  statusBarStyle: "light" | "dark";
};

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/** CSS variables consumed by the semantic tailwind colours (see tailwind.config.js). */
export const tokensToCssVars = (tokens: Tokens): Record<string, string> =>
  Object.fromEntries(
    Object.entries(tokens).map(([k, v]) => [`--color-${kebab(k)}`, v])
  );

const ThemeContext = createContext<ThemeContextValue>({
  preference: "system",
  setPreference: () => {},
  scheme: "light",
  isDark: false,
  tokens: lightTokens,
  statusBarStyle: "dark",
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");

  useEffect(() => {
    let active = true;
    loadThemePreference().then((p) => {
      if (active) setPreferenceState(p);
    });
    return () => {
      active = false;
    };
  }, []);

  // Make native chrome (alerts, keyboards, system modals) follow the override.
  useEffect(() => {
    Appearance.setColorScheme(
      preference === "system" ? "unspecified" : preference
    );
  }, [preference]);

  const setPreference = useCallback((pref: ThemePreference) => {
    setPreferenceState(pref);
    void saveThemePreference(pref);
  }, []);

  const scheme: Scheme =
    preference === "system"
      ? systemScheme === "dark"
        ? "dark"
        : "light"
      : preference;

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      setPreference,
      scheme,
      isDark: scheme === "dark",
      tokens: scheme === "dark" ? darkTokens : lightTokens,
      statusBarStyle: scheme === "dark" ? "light" : "dark",
    }),
    [preference, setPreference, scheme]
  );

  const rootStyle = useMemo(
    () => [
      { flex: 1, backgroundColor: value.tokens.background },
      vars(tokensToCssVars(value.tokens)),
    ],
    [value.tokens]
  );

  return (
    <ThemeContext.Provider value={value}>
      <View style={rootStyle}>{children}</View>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

type NamedStyles = Record<string, ViewStyle | TextStyle | ImageStyle>;

/** Theme-aware StyleSheet: `const styles = useThemedStyles((t) => ({ ... }))`. */
export function useThemedStyles<T extends NamedStyles>(
  factory: (tokens: Tokens, isDark: boolean) => T
): T {
  const { tokens, isDark } = useTheme();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(
    () => StyleSheet.create(factory(tokens, isDark)),
    [tokens, isDark]
  );
}
