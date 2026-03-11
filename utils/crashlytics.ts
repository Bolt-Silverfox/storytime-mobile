import crashlytics from "@react-native-firebase/crashlytics";

function getCrashlytics() {
  try {
    return crashlytics();
  } catch {
    return null;
  }
}

export function initCrashlytics() {
  getCrashlytics()?.setCrashlyticsCollectionEnabled(true);
}

export function setCrashlyticsUser(id: string) {
  getCrashlytics()?.setUserId(id);
}

export function clearCrashlyticsUser() {
  getCrashlytics()?.setUserId("");
}

export function logNonFatal(error: unknown) {
  const instance = getCrashlytics();
  if (!instance) return;
  if (error instanceof Error) {
    instance.recordError(error);
  } else {
    instance.recordError(new Error(String(error)));
  }
}

export function crashlyticsLog(message: string) {
  getCrashlytics()?.log(message);
}
