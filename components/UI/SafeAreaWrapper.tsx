import { useMemo } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../theme/ThemeContext";

type SafeAreaWrapperProps = {
  variant: "solid" | "transparent";
  backgroundColor?: string;
  statusBarStyle?: "light" | "dark";
  children: React.ReactNode;
};

const SafeAreaWrapper = ({
  variant,
  backgroundColor,
  statusBarStyle,
  children,
}: SafeAreaWrapperProps) => {
  const { tokens, statusBarStyle: themeStatusBar } = useTheme();
  const bg = backgroundColor ?? tokens.surface;
  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        backgroundColor: variant === "solid" ? bg : "transparent",
      },
    ],
    [variant, bg]
  );

  return (
    <>
      <StatusBar style={statusBarStyle ?? themeStatusBar} />
      <SafeAreaView
        style={containerStyle}
        edges={
          variant === "transparent" ? ["left", "right", "bottom"] : undefined
        }
      >
        {children}
      </SafeAreaView>
    </>
  );
};

export default SafeAreaWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
