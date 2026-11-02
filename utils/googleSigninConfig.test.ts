/**
 * Guards STORYTIME-MOBILE-2: GIDSignIn throws NSInvalidArgumentException on iOS
 * when the reversed iOS client ID is not registered as a URL scheme in
 * Info.plist. The google-signin config plugin is what writes it, so the plugin
 * must be present with an `iosUrlScheme` equal to the reversed iOS client ID
 * used by every EAS build profile (including the blue variant).
 */
import appJson from "../app.json";
import easJson from "../eas.json";

type PluginEntry = string | [string, Record<string, string>?];

const reverseClientId = (clientId: string): string =>
  `com.googleusercontent.apps.${clientId.replace(
    ".apps.googleusercontent.com",
    ""
  )}`;

const googlePlugin = (appJson.expo.plugins as PluginEntry[]).find(
  (p) =>
    Array.isArray(p) && p[0] === "@react-native-google-signin/google-signin"
);

describe("Google Sign-In iOS URL scheme", () => {
  it("registers the config plugin with an iosUrlScheme", () => {
    expect(googlePlugin).toBeDefined();
    const scheme = (googlePlugin as [string, Record<string, string>])[1]
      ?.iosUrlScheme;
    expect(scheme).toMatch(/^com\.googleusercontent\.apps\./);
  });

  const profiles = Object.entries(
    easJson.build as Record<string, { env?: Record<string, string> }>
  );

  it.each(profiles)(
    "matches EXPO_PUBLIC_IOS_CLIENT_ID in the %s EAS profile",
    (_name, profile) => {
      const clientId = profile.env?.EXPO_PUBLIC_IOS_CLIENT_ID;
      expect(clientId).toBeTruthy();
      const scheme = (googlePlugin as [string, Record<string, string>])[1]
        ?.iosUrlScheme;
      expect(scheme).toBe(reverseClientId(clientId as string));
    }
  );
});
