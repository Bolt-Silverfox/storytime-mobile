import crashlytics from "@react-native-firebase/crashlytics";

export function initCrashlytics() {
  crashlytics().setCrashlyticsCollectionEnabled(true);
}

export function setCrashlyticsUser(id: string) {
  crashlytics().setUserId(id);
}

export function clearCrashlyticsUser() {
  crashlytics().setUserId("");
}

export function logNonFatal(error: unknown) {
  if (error instanceof Error) {
    crashlytics().recordError(error);
  } else {
    crashlytics().recordError(new Error(String(error)));
  }
}

export function crashlyticsLog(message: string) {
  crashlytics().log(message);
}
