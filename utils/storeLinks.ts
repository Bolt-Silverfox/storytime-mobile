import { Linking, Platform } from "react-native";
import { BUNDLE_IDENTIFIER } from "../constants";

/**
 * Opens the app's store listing so the user can leave a rating. We deliberately
 * avoid expo-store-review (which would require a native rebuild) and just deep
 * link to the store, mirroring the Platform.select store-URL pattern used in
 * components/SubscriptionDetails.tsx. The Android listing is keyed by the real
 * package name (BUNDLE_IDENTIFIER); iOS reuses the same identifier.
 */
const openStoreForRating = (): void => {
  const url = Platform.select({
    ios: `https://apps.apple.com/app/${BUNDLE_IDENTIFIER}`,
    android: `https://play.google.com/store/apps/details?id=${BUNDLE_IDENTIFIER}`,
  });
  if (url) {
    Linking.openURL(url).catch(() => {
      // Ignore: user may have no browser/store; rating is best-effort.
    });
  }
};

export { openStoreForRating };
