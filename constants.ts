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
} as const;

/** Maximum image upload size in bytes (5 MB), matching backend limit. */
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export {
  emailRegex,
  BASE_URL,
  WEB_CLIENT_ID,
  IOS_CLIENT_ID,
  SUBSCRIPTION_IDS,
  QUERY_KEYS,
  BUNDLE_IDENTIFIER,
  MAX_IMAGE_SIZE,
};
