/**
 * Guards STORYTIME-MOBILE-2: GIDSignIn throws NSInvalidArgumentException on iOS
 * when the reversed iOS client ID is not a registered URL scheme in Info.plist.
 *
 * In v1.3.0 the google-signin plugin's `iosUrlScheme` alone did not reach
 * Info.plist; the scheme only landed once it was also declared as
 * `expo.ios.scheme` (Expo appends those to CFBundleURLTypes). So assert the
 * outcome: after app.config.js resolves the config, the reversed iOS client ID
 * of every EAS profile is in the iOS URL schemes.
 */
import appJson from "../app.json";
import easJson from "../eas.json";

const withDynamicConfig = require("../app.config.js").default as (ctx: {
  config: Record<string, any>;
}) => Record<string, any>;

type PluginEntry = string | [string, Record<string, string>?];

const reverseClientId = (clientId: string): string =>
  `com.googleusercontent.apps.${clientId.replace(
    ".apps.googleusercontent.com",
    ""
  )}`;

const profiles = Object.entries(
  easJson.build as Record<string, { env?: Record<string, string> }>
);

const resolved = withDynamicConfig({ config: appJson.expo });
const plugin = (resolved.plugins as PluginEntry[]).find(
  (p) =>
    Array.isArray(p) && p[0] === "@react-native-google-signin/google-signin"
) as [string, Record<string, string>] | undefined;

describe("Google Sign-In iOS URL scheme", () => {
  it.each(profiles)(
    "puts the reversed iOS client id of the %s profile in the iOS URL schemes",
    (_name, profile) => {
      const clientId = profile.env?.EXPO_PUBLIC_IOS_CLIENT_ID;
      expect(clientId).toBeTruthy();
      const scheme = reverseClientId(clientId as string);
      expect(resolved.ios.scheme).toContain(scheme);
      expect(plugin?.[1]?.iosUrlScheme).toBe(scheme);
    }
  );
});
