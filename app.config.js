// Dynamic config overlay:
//  1) Feed the EAS secret *file* env vars (GOOGLE_SERVICE_INFO_PLIST /
//     GOOGLE_SERVICES_JSON) into the Firebase config fields so cloud (EAS)
//     builds get the GoogleServices files, which are gitignored. Falls back to
//     the local repo paths for local builds.
//  2) Blue-green: when APP_VARIANT=blue (set by the "blue" EAS profile), give a
//     distinct app name + bundle identifier / package so the blue build (points
//     at blue.dev.api) installs SIDE-BY-SIDE with green instead of overwriting
//     it — letting a single device run both for validation.
const IS_BLUE = process.env.APP_VARIANT === "blue";

export default ({ config }) => ({
  ...config,
  name: IS_BLUE ? `${config.name} Blue` : config.name,
  ios: {
    ...config.ios,
    bundleIdentifier: IS_BLUE
      ? `${config.ios.bundleIdentifier}.blue`
      : config.ios.bundleIdentifier,
    googleServicesFile:
      process.env.GOOGLE_SERVICE_INFO_PLIST ?? "./GoogleService-Info.plist",
  },
  android: {
    ...config.android,
    package: IS_BLUE
      ? `${config.android.package}.blue`
      : config.android.package,
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
  },
});
