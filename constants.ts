const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;
const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_WEB_CLIENT_ID;
const BUNDLE_IDENTIFIER = "net.emerj.storytime";
const SUBSCRIPTION_IDS = ["1_month_subscription", "1_year_subscription"];
const QUERY_KEYS = {
  GET_SUBSCRIPTION_STATUS: "paymentStatus",
  GET_USER_PROFILE: "userProfile",
} as const;

export {
  emailRegex,
  BASE_URL,
  WEB_CLIENT_ID,
  IOS_CLIENT_ID,
  SUBSCRIPTION_IDS,
  QUERY_KEYS,
  BUNDLE_IDENTIFIER,
};
