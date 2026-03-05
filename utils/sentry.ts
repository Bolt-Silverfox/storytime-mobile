import * as Sentry from "@sentry/react-native";

const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;

export const reactNavigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});

export function initSentry() {
  if (__DEV__ || !SENTRY_DSN) return;

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: "production",

    tracesSampleRate: 0.2,
    profilesSampleRate: 0.1,

    enableNative: true,
    enableNativeCrashHandling: true,
    enableAutoPerformanceTracing: true,
    enableAppStartTracking: true,
    enableNativeFramesTracking: true,

    integrations: [
      Sentry.reactNativeTracingIntegration({
        enableHTTPTimings: true,
      }),
      reactNavigationIntegration,
    ],

    beforeSend(event) {
      // Redact Authorization headers from breadcrumbs
      if (event.breadcrumbs) {
        event.breadcrumbs = event.breadcrumbs.map((breadcrumb) => {
          if (breadcrumb.data?.headers) {
            const headers = { ...breadcrumb.data.headers } as Record<
              string,
              unknown
            >;
            for (const key of Object.keys(headers)) {
              if (key.toLowerCase() === "authorization") {
                headers[key] = "[REDACTED]";
              }
            }
            return { ...breadcrumb, data: { ...breadcrumb.data, headers } };
          }
          return breadcrumb;
        });
      }
      return event;
    },
  });
}

export function setSentryUser(id: string, email?: string) {
  if (__DEV__) return;
  Sentry.setUser({ id, email });
}

export function clearSentryUser() {
  if (__DEV__) return;
  Sentry.setUser(null);
}

export { Sentry };
