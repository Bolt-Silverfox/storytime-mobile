import * as Sentry from "@sentry/react-native";

const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;

export const reactNavigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});

// Auto-initialize on import so Sentry.wrap() in App.tsx has an active client
if (SENTRY_DSN && !__DEV__) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.EXPO_PUBLIC_SENTRY_ENV ?? "production",
    debug: false,

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

export function initSentry() {
  // Sentry is now auto-initialized on import above.
  // Kept for backward compatibility with index.ts.
}

export function setSentryUser(id: string, email?: string) {
  Sentry.setUser({ id, email });
}

export function clearSentryUser() {
  Sentry.setUser(null);
}

export { Sentry };
