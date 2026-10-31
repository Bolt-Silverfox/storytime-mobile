import { DarkTheme, DefaultTheme, Theme } from "@react-navigation/native";
import { Tokens } from "./tokens";

export const buildNavigationTheme = (
  tokens: Tokens,
  isDark: boolean
): Theme => {
  const base = isDark ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: tokens.brandText,
      background: tokens.background,
      card: tokens.surface,
      text: tokens.textStrong,
      border: tokens.borderLight,
      notification: tokens.brand,
    },
  };
};
