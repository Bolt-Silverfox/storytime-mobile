import {
  logger,
  consoleTransport,
  transportFunctionType,
} from "react-native-logs";
import * as Sentry from "@sentry/react-native";
import crashlytics from "@react-native-firebase/crashlytics";

/** Map react-native-logs level names to valid Sentry SeverityLevel values */
const SENTRY_LEVEL_MAP: Record<string, Sentry.SeverityLevel> = {
  debug: "debug",
  info: "info",
  warn: "warning",
  error: "error",
};

/** Safely serialize a message, handling circular references */
function safeSerialize(msg: unknown): string {
  if (typeof msg === "string") return msg;
  try {
    return JSON.stringify(msg);
  } catch {
    return String(msg);
  }
}

/**
 * Lazy Sentry transport — defers access to the Sentry SDK until the first log
 * call, so the transport can be registered before `Sentry.init()` runs.
 */
const sentryTransport: transportFunctionType<object> = (props) => {
  const SentrySDK = require("@sentry/react-native") as typeof Sentry;
  const client = SentrySDK.getClient();
  if (!client) return; // SDK not initialised yet — silently skip

  const message = safeSerialize(props.msg);

  if (props.level.text === "error") {
    SentrySDK.captureException(
      props.rawMsg instanceof Error ? props.rawMsg : new Error(message)
    );
  } else {
    SentrySDK.addBreadcrumb({
      category: "log",
      message,
      level: SENTRY_LEVEL_MAP[props.level.text] ?? "info",
    });
  }
};

/**
 * Lazy Crashlytics transport — defers the `crashlytics()` call so Firebase
 * has time to initialise before the transport is first invoked.
 */
const crashlyticsTransport: transportFunctionType<object> = (props) => {
  const crash = require("@react-native-firebase/crashlytics")
    .default as typeof crashlytics;

  const message = safeSerialize(props.msg);

  if (props.level.text === "error") {
    crash().recordError(
      props.rawMsg instanceof Error ? props.rawMsg : new Error(message)
    );
  } else {
    crash().log(message);
  }
};

const log = logger.createLogger({
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  severity: __DEV__ ? "debug" : "warn",
  transport: [consoleTransport, sentryTransport, crashlyticsTransport],
  transportOptions: {
    colors: {
      info: "blueBright",
      warn: "yellowBright",
      error: "redBright",
    },
  },
  async: true,
  dateFormat: "time",
  printLevel: true,
  printDate: true,
  enabled: true,
});

export const authLogger = log.extend("AUTH");
export const apiLogger = log.extend("API");
export const notifLogger = log.extend("NOTIF");
export const iapLogger = log.extend("IAP");
export const audioLogger = log.extend("AUDIO");

export default log;
