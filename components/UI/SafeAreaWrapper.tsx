import { useMemo } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type SafeAreaWrapperProps = {
  variant: "solid" | "transparent";
  backgroundColor?: string;
  statusBarStyle?: "light" | "dark";
  children: React.ReactNode;
};

const SafeAreaWrapper = ({
  variant,
  backgroundColor = "white",
  statusBarStyle = "dark",
  children,
}: SafeAreaWrapperProps) => {
  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        backgroundColor: variant === "solid" ? backgroundColor : "transparent",
      },
    ],
    [variant, backgroundColor]
  );

  return (
    <>
      <StatusBar style={statusBarStyle} />
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
