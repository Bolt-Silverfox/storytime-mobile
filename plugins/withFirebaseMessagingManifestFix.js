/* global require module */
const { withDangerousMod } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

/**
 * Safety net: patches any Android variant manifest that has Firebase
 * notification meta-data WITHOUT tools:replace attributes.
 *
 * The primary fix is firebase.json (which aligns placeholder values so the
 * manifest merger doesn't conflict). This plugin is a defensive fallback
 * in case values ever diverge again.
 */

function patchManifestXml(xml) {
  // Order-agnostic: match <meta-data> with target android:name anywhere in the element
  xml = xml.replace(
    /(<meta-data\b[^>]*\bandroid:name="com\.google\.firebase\.messaging\.default_notification_channel_id"[^>]*?)(\s*\/?>)/,
    (m, body, close) =>
      body.includes("tools:replace")
        ? m
        : `${body} tools:replace="android:value"${close}`
  );
  xml = xml.replace(
    /(<meta-data\b[^>]*\bandroid:name="com\.google\.firebase\.messaging\.default_notification_color"[^>]*?)(\s*\/?>)/,
    (m, body, close) =>
      body.includes("tools:replace")
        ? m
        : `${body} tools:replace="android:resource"${close}`
  );
  if (xml.includes("tools:replace") && !xml.includes("xmlns:tools=")) {
    xml = xml.replace(
      /(<manifest\b)/,
      '$1\n    xmlns:tools="http://schemas.android.com/tools"'
    );
  }
  return xml;
}

module.exports = function withFirebaseMessagingManifestFix(config) {
  return withDangerousMod(config, [
    "android",
    (config) => {
      const variants = ["main", "debug", "debugOptimized", "release"];
      for (const variant of variants) {
        const manifestPath = path.join(
          config.modRequest.platformProjectRoot,
          "app",
          "src",
          variant,
          "AndroidManifest.xml"
        );
        if (fs.existsSync(manifestPath)) {
          const original = fs.readFileSync(manifestPath, "utf8");
          const patched = patchManifestXml(original);
          if (patched !== original) {
            fs.writeFileSync(manifestPath, patched, "utf8");
          }
        }
      }
      return config;
    },
  ]);
};
