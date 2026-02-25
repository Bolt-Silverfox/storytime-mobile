const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;
const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_WEB_CLIENT_ID;
const BUNDLE_IDENTIFIER = "net.emerj.storytime";
const SUBSCRIPTION_IDS = [
  "1_month_subscription",
  "1_year_subscription",
] as const;
const QUERY_KEYS = {
  GET_SUBSCRIPTION_STATUS: "paymentStatus",
  GET_USER_PROFILE: "userProfile",
  GET_STORY_QUOTA: "storyQuota",
  GET_LIBRARY_STORIES: "libraryStories",
} as const;

/** Maximum image upload size in bytes (5 MB), matching backend limit. */
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

/** Extension → MIME type map for image uploads. Single source of truth for both
 *  client-side validation (useImagePicker) and upload FormData (uploadUserAvatar). */
const IMAGE_MIME_MAP = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
} as const satisfies Record<string, string>;

const READ_STATUS_COLORS = {
  done: "#16A34A",
  reading: "#EA580C",
} as const;

const DEEP_LINK_BASE_URL = "storytime4kids:/";

export {
  emailRegex,
  BASE_URL,
  WEB_CLIENT_ID,
  IOS_CLIENT_ID,
  SUBSCRIPTION_IDS,
  QUERY_KEYS,
  BUNDLE_IDENTIFIER,
  MAX_IMAGE_SIZE,
  IMAGE_MIME_MAP,
  READ_STATUS_COLORS,
  DEEP_LINK_BASE_URL,
};
