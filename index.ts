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
