import crashlytics from "@react-native-firebase/crashlytics";

export function initCrashlytics() {
  if (__DEV__) {
    crashlytics().setCrashlyticsCollectionEnabled(false);
    return;
  }
  crashlytics().setCrashlyticsCollectionEnabled(true);
}

export function setCrashlyticsUser(id: string) {
  if (__DEV__) return;
  crashlytics().setUserId(id);
}

export function clearCrashlyticsUser() {
  if (__DEV__) return;
  crashlytics().setUserId("");
}

export function logNonFatal(error: unknown) {
  if (__DEV__) return;
  if (error instanceof Error) {
    crashlytics().recordError(error);
  } else {
    crashlytics().recordError(new Error(String(error)));
  }
}

export function crashlyticsLog(message: string) {
  if (__DEV__) return;
  crashlytics().log(message);
}
