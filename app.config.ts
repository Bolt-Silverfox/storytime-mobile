import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  const ios = config.ios ?? {};
  const android = config.android ?? {};

  // In EAS builds, FILE_BASE64 secrets are decoded to a temp file
  // and the env var is set to the file path
  if (process.env.GOOGLE_SERVICE_INFO_PLIST) {
    ios.googleServicesFile = process.env.GOOGLE_SERVICE_INFO_PLIST;
  }
  if (process.env.GOOGLE_SERVICES_JSON) {
    android.googleServicesFile = process.env.GOOGLE_SERVICES_JSON;
  }

  return {
    ...(config as ExpoConfig),
    ios,
    android,
  };
};
