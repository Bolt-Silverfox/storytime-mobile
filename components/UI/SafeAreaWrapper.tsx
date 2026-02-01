import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

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
  return (
    <SafeAreaProvider
      style={[
        styles.container,
        {
          backgroundColor:
            variant === "solid" ? backgroundColor : "transparent",
        },
      ]}
    >
      <StatusBar style={statusBarStyle} />
      <SafeAreaView
        style={styles.container}
        edges={
          variant === "transparent" ? ["left", "right", "bottom"] : undefined
        }
      >
        {children}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default SafeAreaWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
