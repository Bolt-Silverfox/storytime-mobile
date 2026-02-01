import { StatusBar } from "expo-status-bar";
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
      style={{
        flex: 1,
        backgroundColor: variant === "solid" ? backgroundColor : "transparent",
      }}
    >
      <StatusBar style={statusBarStyle} />
      <SafeAreaView
        style={{ flex: 1 }}
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
