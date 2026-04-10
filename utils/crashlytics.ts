import {
  getCrashlytics,
  log,
  recordError,
  setCrashlyticsCollectionEnabled,
  setUserId,
} from "@react-native-firebase/crashlytics";

function getInstance() {
  try {
    return getCrashlytics();
  } catch {
    return null;
  }
}

export function initCrashlytics() {
  const instance = getInstance();
  if (instance) {
    setCrashlyticsCollectionEnabled(instance, true);
  }
}

export function setCrashlyticsUser(id: string) {
  const instance = getInstance();
  if (instance) {
    setUserId(instance, id);
  }
}

export function clearCrashlyticsUser() {
  const instance = getInstance();
  if (instance) {
    setUserId(instance, "");
  }
}

export function logNonFatal(error: unknown) {
  const instance = getInstance();
  if (!instance) return;
  recordError(
    instance,
    error instanceof Error ? error : new Error(String(error))
  );
}

export function crashlyticsLog(message: string) {
  const instance = getInstance();
  if (instance) {
    log(instance, message);
  }
}
