const { withAndroidManifest } = require("expo/config-plugins");

/**
 * Adds tools:replace attributes to Firebase notification meta-data elements
 * to resolve AndroidManifest merger conflicts between expo-notifications
 * and @react-native-firebase/messaging.
 */
module.exports = function withFirebaseMessagingManifestFix(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    const application = manifest.manifest.application?.[0];
    if (!application) return config;

    // Ensure tools namespace is declared
    if (!manifest.manifest.$["xmlns:tools"]) {
      manifest.manifest.$["xmlns:tools"] =
        "http://schemas.android.com/tools";
    }

    const metaData = application["meta-data"] || [];
    for (const item of metaData) {
      const name = item.$?.["android:name"];
      if (
        name ===
        "com.google.firebase.messaging.default_notification_channel_id"
      ) {
        item.$["tools:replace"] = "android:value";
      }
      if (
        name ===
        "com.google.firebase.messaging.default_notification_color"
      ) {
        item.$["tools:replace"] = "android:resource";
      }
    }

    return config;
  });
};
