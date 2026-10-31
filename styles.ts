import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "./theme/ThemeContext";
import { Tokens } from "./theme/tokens";
import colours from "./colours";

export const makeDefaultStyles = (t: Tokens) =>
  StyleSheet.create({
    defaultText: {
      fontSize: 16,
      color: t.textBody,
      fontFamily: "abeezee",
    },
    linkText: {
      fontSize: 16,
      color: t.link,
      fontFamily: "abeezee",
    },
    input: {
      borderColor: t.border,
      color: t.textStrong,
      borderRadius: 60,
      height: 50,
      borderWidth: 1,
      fontSize: 14,
      position: "relative",
      paddingHorizontal: 16,
    },
    heading: {
      fontFamily: "quilka",
      fontSize: 24,
      textAlign: "center",
      color: t.textStrong,
    },
    smallText: {
      fontFamily: "abeezee",
      fontSize: 12,
      color: t.textBody,
    },
    screen: {
      paddingVertical: 46,
      paddingHorizontal: 17,
      backgroundColor: t.background,
      flex: 1,
    },
    label: {
      color: t.textStrong,
      fontSize: 16,
      fontFamily: "abeezee",
    },
    button: {
      backgroundColor: t.brand,
      borderRadius: 100,
      paddingVertical: 12,
      textAlign: "center",
      width: "100%",
      maxWidth: 600,
      alignSelf: "center",
    },
    buttonDisabled: {
      backgroundColor: colours.disabled,
      borderRadius: 100,
      paddingVertical: 12,
      textAlign: "center",
      width: "100%",
      maxWidth: 600,
      alignSelf: "center",
    },
    appleButton: {
      width: 180,
      height: 44,
      maxWidth: "100%",
    },
  });

/** Theme-aware replacement for the old static `defaultStyles` object. */
export const useDefaultStyles = () => {
  const { tokens } = useTheme();
  return useMemo(() => makeDefaultStyles(tokens), [tokens]);
};
