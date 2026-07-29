import { Linking, Platform } from "react-native";
import { BUNDLE_IDENTIFIER } from "../constants";

// Apple's numeric App Store ID (adam id) for net.emerj.storytime — required to
// build a working App Store URL (a bundle-id URL does not resolve). Source:
// https://itunes.apple.com/lookup?bundleId=net.emerj.storytime
const APPLE_APP_STORE_ID = "6756060805";

/**
 * Opens the app's store listing so the user can leave a rating. We deliberately
 * avoid expo-store-review (which would require a native rebuild) and just deep
 * link to the store, mirroring the Platform.select store-URL pattern used in
 * components/SubscriptionDetails.tsx. iOS deep-links straight to the write-review
 * sheet; Android opens the listing keyed by the real package name.
 */
const openStoreForRating = (): void => {
  const url = Platform.select({
    ios: `https://apps.apple.com/app/id${APPLE_APP_STORE_ID}?action=write-review`,
    android: `https://play.google.com/store/apps/details?id=${BUNDLE_IDENTIFIER}`,
  });
  if (url) {
    Linking.openURL(url).catch(() => {
      // Ignore: user may have no browser/store; rating is best-effort.
    });
  }
};

export { openStoreForRating };
