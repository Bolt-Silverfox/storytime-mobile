import * as Sentry from "@sentry/react-native";
import { reactNavigationIntegration } from "@sentry/react-native";

const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;

// Create the React Navigation integration
const reactNavigationIntegrationInstance = reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});

// Auto-initialize on import so Sentry.wrap() in App.tsx always has an active
// client (avoids the "Sentry.wrap was called before Sentry.init" warning).
// We still initialize in dev, but `enabled: !__DEV__` means no events are sent
// from development builds.
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    enabled: !__DEV__,
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
      // The reactNavigationIntegration returns a ReactNavigationInstrumentation
      // which implements the Integration interface at runtime but TypeScript
      // doesn't recognize it due to missing setupOnce in the type definition.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reactNavigationIntegrationInstance as any,
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

export { reactNavigationIntegrationInstance as reactNavigationIntegration };

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
