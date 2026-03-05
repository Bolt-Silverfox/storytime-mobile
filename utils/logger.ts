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

const sentryTransport: transportFunctionType<object> = (props) => {
  if (__DEV__) return;

  const message = safeSerialize(props.msg);

  if (props.level.text === "error") {
    Sentry.captureException(
      props.rawMsg instanceof Error ? props.rawMsg : new Error(message)
    );
  } else {
    Sentry.addBreadcrumb({
      category: "log",
      message,
      level: SENTRY_LEVEL_MAP[props.level.text] ?? "info",
    });
  }
};

const crashlyticsTransport: transportFunctionType<object> = (props) => {
  if (__DEV__) return;

  const message = safeSerialize(props.msg);

  if (props.level.text === "error") {
    crashlytics().recordError(
      props.rawMsg instanceof Error ? props.rawMsg : new Error(message)
    );
  } else {
    crashlytics().log(message);
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
  transport: __DEV__
    ? consoleTransport
    : [consoleTransport, sentryTransport, crashlyticsTransport],
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
