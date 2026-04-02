import Netinfo from "@react-native-community/netinfo";
import {
  LinkingOptions,
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { audioLogger } from "./utils/logger";
import { reactNavigationIntegration } from "./utils/sentry";
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
  onlineManager,
} from "@tanstack/react-query";
import { ApiError } from "./apiFetch";
import { useFonts } from "expo-font";
import { setAudioModeAsync } from "expo-audio";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";
import * as Linking from "expo-linking";
import CustomSplashScreen from "./components/CustomSplashScreen";
import ErrorBoundary from "./components/ErrorBoundary";
import NotificationHandler from "./components/NotificationHandler";
import { AuthProvider } from "./contexts/AuthContext";
import "./global.css";
import RootNavigator, {
  RootNavigatorParamList,
} from "./Navigation/RootNavigator";
import { ToastProvider } from "./contexts/ToastContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

const prefix = Linking.createURL("/");

const linking: LinkingOptions<RootNavigatorParamList> = {
  prefixes: [prefix, "storytime://", "https://www.storytimeapp.me"],
  config: {
    screens: {
      protected: {
        screens: {
          stories: {
            screens: {
              storyDeepLink: "story/:storyId",
            },
          },
        },
      },
    },
  } as LinkingOptions<RootNavigatorParamList>["config"],
};

SplashScreen.preventAutoHideAsync();

setAudioModeAsync({
  playsInSilentMode: true,
  shouldPlayInBackground: false,
  interruptionMode: "mixWithOthers",
}).catch((e) => {
  audioLogger.warn("setAudioModeAsync failed:", e);
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Retry 429s with backoff up to 3 times
        if (error instanceof ApiError && error.status === 429) {
          return failureCount < 3;
        }
        // Default: retry non-4xx errors up to 3 times
        if (
          error instanceof ApiError &&
          error.status >= 400 &&
          error.status < 500
        ) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex, error) => {
        // Longer backoff for 429s
        if (error instanceof ApiError && error.status === 429) {
          return Math.min(1000 * 2 ** attemptIndex, 10000);
        }
        return Math.min(1000 * 2 ** attemptIndex, 30000);
      },
    },
  },
});
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
  const navigationRef = useNavigationContainerRef<RootNavigatorParamList>();
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
      <SafeAreaProvider>
        <AuthProvider>
          <ToastProvider>
            <QueryClientProvider client={queryClient}>
              <NavigationContainer
                ref={navigationRef}
                linking={linking}
                onReady={() => {
                  reactNavigationIntegration.registerNavigationContainer(
                    navigationRef
                  );
                }}
              >
                <NotificationHandler>
                  <RootNavigator />
                </NotificationHandler>
              </NavigationContainer>
            </QueryClientProvider>
          </ToastProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
