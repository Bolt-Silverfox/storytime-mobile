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
  GET_INFINITE_STORIES: "stories",
  GET_STORY_PROGRESS: "storyProgress",
  GET_LINKED_ACCOUNTS: "linkedAccounts",
} as const;

/** Default page size for cursor-paginated API calls. */
const DEFAULT_CURSOR_PAGE_SIZE = 20;

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

/** Deep link prefix for shareable story links. */
const SHARE_DEEP_LINK_URL = "storytime://story";

/** Story deep link route path (used in navigation config). */
const STORY_DEEP_LINK_ROUTE = "story/:storyId";

/** Helper to construct full story deep link. */
const makeStoryDeepLink = (storyId: string) =>
  `${SHARE_DEEP_LINK_URL}/${storyId}`;

/** Duration of the story controls fade animation in ms. */
const CONTROLS_FADE_MS = 200;

/** Default ElevenLabs voice ID assigned to guest users. */
const GUEST_DEFAULT_VOICE_ID = "XrExE9yKIg1WjnnlVkGX";

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
  SHARE_DEEP_LINK_URL,
  STORY_DEEP_LINK_ROUTE,
  makeStoryDeepLink,
  CONTROLS_FADE_MS,
  DEFAULT_CURSOR_PAGE_SIZE,
  GUEST_DEFAULT_VOICE_ID,
};
