import {
  logger,
  consoleTransport,
  transportFunctionType,
} from "react-native-logs";
import * as Sentry from "@sentry/react-native";
import { logNonFatal, crashlyticsLog } from "./crashlytics";

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
 * Crashlytics transport — routes logs through the safe wrappers in
 * crashlytics.ts that handle missing native modules (e.g. emulators).
 */
const crashlyticsTransport: transportFunctionType<object> = (props) => {
  const message = safeSerialize(props.msg);

  if (props.level.text === "error") {
    logNonFatal(
      props.rawMsg instanceof Error ? props.rawMsg : new Error(message)
    );
  } else {
    crashlyticsLog(message);
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
export const quizLogger = log.extend("QUIZ");
export const guestLogger = log.extend("GUEST");

export default log;
