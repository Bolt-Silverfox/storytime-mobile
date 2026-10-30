import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Appearance, View, useColorScheme } from "react-native";
import { vars } from "nativewind";
import {
  ThemePreference,
  loadThemePreference,
  saveThemePreference,
} from "./themeStorage";
import { tokensToCssVars } from "./cssVars";
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

export { tokensToCssVars };

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
