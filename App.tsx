import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import colours from "./colours";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import CustomSplashScreen from "./components/CustomSplashScreen";
import { AuthProvider } from "./contexts/AuthContext";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loaded, error] = useFonts({
    quilka: require("./assets/fonts/Qilkabold-DO6BR.otf"),
    abeezee: require("./assets/fonts/ABeeZee-Regular.ttf"),
  });
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      if (loaded || error) {
        await SplashScreen.hideAsync();
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setAppReady(true);
      }
    }
    prepare();
  }, [loaded, error]);

  if (!appReady) return <CustomSplashScreen />;

  return (
    <AuthProvider>
      <View style={styles.container}>
        <Text>Open up App.tsx to start working on your app!</Text>
        <StatusBar style="auto" />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
