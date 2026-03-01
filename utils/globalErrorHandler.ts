import { Sentry } from "./sentry";
import { logNonFatal } from "./crashlytics";
import log from "./logger";

export function setupGlobalErrorHandlers() {
  // Catch unhandled JS errors
  const previousHandler = ErrorUtils.getGlobalHandler();
  ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
    log.error("Unhandled JS error:", error);
    Sentry.captureException(error, {
      level: isFatal ? "fatal" : "error",
    });
    logNonFatal(error);

    // Call the previous handler so RN can show the red screen in dev
    if (previousHandler) {
      previousHandler(error, isFatal);
    }
  });

  // Catch unhandled promise rejections
  const originalHandler = (global as Record<string, unknown>)
    .onunhandledrejection as ((event: { reason: unknown }) => void) | undefined;

  (global as Record<string, unknown>).onunhandledrejection = (event: {
    reason: unknown;
  }) => {
    const error =
      event.reason instanceof Error
        ? event.reason
        : new Error(String(event.reason));

    log.error("Unhandled promise rejection:", error);
    Sentry.captureException(error);
    logNonFatal(error);

    if (originalHandler) {
      originalHandler(event);
    }
  };
}
