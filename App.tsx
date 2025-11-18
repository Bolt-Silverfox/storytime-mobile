import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import CustomSplashScreen from "./components/CustomSplashScreen";
import { AuthProvider } from "./contexts/AuthContext";
import RootNavigator from "./Navigation/RootNavigator";
import "./global.css";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loaded, error] = useFonts({
    quilka: require("./assets/fonts/Qilkabold-DO6BR.otf"),
    abeezee: require("./assets/fonts/ABeeZee-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded || error) return <CustomSplashScreen />;

  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </NavigationContainer>
    </>
  );
}
