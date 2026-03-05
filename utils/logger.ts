import { logger, consoleTransport } from "react-native-logs";

const log = logger.createLogger({
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  severity: __DEV__ ? "debug" : "warn",
  transport: consoleTransport,
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
