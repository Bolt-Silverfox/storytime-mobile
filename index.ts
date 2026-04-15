// Temporary: throw on any deprecated react-native-firebase namespaced API
// usage at runtime to catch missed migrations to the modular API.
// Remove after the modular API migration is verified in production.
// Must be set BEFORE any @react-native-firebase/* import.
(
  globalThis as { RNFB_MODULAR_DEPRECATION_STRICT_MODE?: boolean }
).RNFB_MODULAR_DEPRECATION_STRICT_MODE = true;

import { registerRootComponent } from "expo";

import { initSentry } from "./utils/sentry";
import { initCrashlytics } from "./utils/crashlytics";
import { setupGlobalErrorHandlers } from "./utils/globalErrorHandler";

import App from "./App";

initSentry();
initCrashlytics();
setupGlobalErrorHandlers();

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
