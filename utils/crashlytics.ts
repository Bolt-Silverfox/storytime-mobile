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
  } catch (e) {
    // Log in dev for visibility; production returns null gracefully
    if (__DEV__) {
      console.warn("Failed to get Crashlytics instance:", e);
    }
    return null;
  }
}

export function initCrashlytics() {
  const instance = getInstance();
  if (instance) {
    setCrashlyticsCollectionEnabled(instance, true).catch((e) => {
      if (__DEV__) console.warn("Failed to enable Crashlytics:", e);
    });
  }
}

export function setCrashlyticsUser(id: string) {
  const instance = getInstance();
  if (instance) {
    setUserId(instance, id).catch((e) => {
      if (__DEV__) console.warn("Failed to set Crashlytics user ID:", e);
    });
  }
}

export function clearCrashlyticsUser() {
  const instance = getInstance();
  if (instance) {
    setUserId(instance, "").catch((e) => {
      if (__DEV__) console.warn("Failed to clear Crashlytics user ID:", e);
    });
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
