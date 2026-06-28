// Dynamic config overlay: feed the EAS secret *file* environment variables
// (GOOGLE_SERVICE_INFO_PLIST / GOOGLE_SERVICES_JSON) into the Firebase config
// fields so cloud (EAS) builds get the GoogleServices files, which are gitignored.
// Falls back to the local repo paths for local builds.
export default ({ config }) => ({
  ...config,
  ios: {
    ...config.ios,
    googleServicesFile:
      process.env.GOOGLE_SERVICE_INFO_PLIST ?? './GoogleService-Info.plist',
  },
  android: {
    ...config.android,
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
  },
});
