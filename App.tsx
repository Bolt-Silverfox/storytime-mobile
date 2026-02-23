import Netinfo from "@react-native-community/netinfo";
import { NavigationContainer } from "@react-navigation/native";
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
  onlineManager,
} from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";
import CustomSplashScreen from "./components/CustomSplashScreen";
import ErrorBoundary from "./components/ErrorBoundary";
import NotificationHandler from "./components/NotificationHandler";
import { AuthProvider } from "./contexts/AuthContext";
import "./global.css";
import RootNavigator from "./Navigation/RootNavigator";
import { ToastProvider } from "./contexts/ToastContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();
onlineManager.setEventListener((setOnline) => {
  return Netinfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});

const onAppStateChange = (status: AppStateStatus) => {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
};

export default function App() {
  const [loaded, error] = useFonts({
    quilka: require("./assets/fonts/Qilkabold-DO6BR.otf"),
    abeezee: require("./assets/fonts/ABeeZee-Regular.ttf"),
  });

  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded || error) return <CustomSplashScreen />;

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer>
              <NotificationHandler>
                <RootNavigator />
              </NotificationHandler>
            </NavigationContainer>
          </QueryClientProvider>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
