type QueryResponse<T = {}> = {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
};

export type Avatar = {
  id: string;
  name: string;
  url: string;
  isSystemAvatar: boolean;
  isDeleted: boolean;
  createdAt: string;
  deletedAt: string | null;
  displayName: string | null;
  publicId: string | null;
};
type Profile = {
  id: string;
  explicitContent: boolean;
  maxScreenTimeMins: number;
  language: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

type User = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  profile: Profile;
  numberOfKids: number;
};

type KidProfile = {
  id: string;
  name: string;
  avatarId: string | null;
  ageRange: string;
  dailyScreenTimeLimitMins: null | number;
  parentId: string;
  currentReadingLevel: number;
  createdAt: string;
  updatedAt: string;
  preferredVoiceId: string;
  excludedTags: string[];
  isBedtimeEnabled: boolean;
  bedtimeStart: string | null;
  bedtimeEnd: string | null;
  bedtimeDays: number[];
  bedtimeLockApp: boolean;
  bedtimeDimScreen: boolean;
  bedtimeReminder: boolean;
  bedtimeStoriesOnly: boolean;
  storyBuddyId: string | null;
  avatar: Avatar | null;
  parent: {
    id: string;
    name: string;
    email: string;
  };
};
type KidType = {
  statusCode: number;
  success: boolean;
  data: KidProfile[];
  message: string;
};

type SystemAvatar = {
  id: string;
  name: string;
  url: string;
  isSystemAvatar: boolean;
  isDeleted: boolean;
  deletedAt: null | string;
  publicId: null | string;
  createdAt: string;
};

type UserProfile = {
  id: string;
  email: string;
  title: string;
  name: string;
  avatar: Avatar | null;
  profile: {
    country: string;
    explicitContent: boolean;
    language: string;
    maxScreenTimeMins: null | string | number;
  };
  role: "admin" | "parent";
  numberOfKids: number;
  pinSet: boolean;
  biometricsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  subscriptionStatus: "free" | "active";
};

type KidReport = {
  kidId: string;
  kidName: string;
  avatarUrl?: string;
  rank: number;
  storiesCompleted: number;
  screenTimeMins: number;
  starsEarned: number;
  badgesEarned: number;
};

type WeeklyReport = {
  weekStartDate: string;
  weekEndDate: string;
  kids: KidReport[];
  totalStoriesCompleted: number;
  totalScreenTimeMins: number;
};

type ValidParentControlsRoutes =
  | "contentFilter"
  | "excludeStoryTags"
  | "recordVoice"
  | "customizeReadingVoices"
  | "setBedtime"
  | "setDailyLimit"
  | "viewActivityLog";

type StoryModes = "interactive" | "plain";

type LearningExpectation = {
  id: string;
  name: string;
  description: string;
  category: null | string;
};

type Story = {
  id: string;
  title: string;
  description: string;
  language: string;
  coverImageUrl: string;
  audioUrl: string;
  textContent: string;
  isInteractive: boolean;
  ageMin: number;
  ageMax: number;
  backgroundColor: string;
  recommended: boolean;
  aiGenerated: boolean;
  difficultyLevel: number;
  wordCount: number;
  durationSeconds: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
  isRead?: boolean;
  creatorKidId: null | string;
  images: string[];
  branches: string[];
  categories: {
    id: string;
    name: string;
    image: string;
    description: string;
    isDeleted: boolean;
    deletedAt: null | string;
  }[];
  themes: {
    id: string;
    name: string;
    image: string | null;
    description: string;
    isDeleted: boolean;
    deletedAt: string | null;
  }[];
  questions: {
    id: string;
    storyId: string;
    question: string;
    options: string[];
    correctOption: number;
    isDeleted: boolean;
    deletedAt: string | null;
  }[];
};

type ChildStoryStatus = "ongoing" | "completed";

type StoryBuddy = {
  id: string;
  name: string;
  displayName: string;
  description: string;
  type: string;
  imageUrl: string;
  profileAvatarUrl: string;
  isActive: boolean;
  themeColor: string;
  ageGroupMin: number;
  ageGroupMax: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
};

type FavouriteStory = Pick<
  Story,
  | "id"
  | "title"
  | "description"
  | "coverImageUrl"
  | "categories"
  | "createdAt"
  | "durationSeconds"
> & { storyId: string; ageRange: string };

type AvailableVoices = {
  id: string;
  name: string;
  displayName: string;
  type: string;
  previewUrl: string;
  voiceAvatar: string;
  elevenLabsVoiceId: string;
};

type PaginatedData<T> = {
  data: T;
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
  };
};

const ageGroups = ["All", "1-3", "4-6", "7-9", "10-12"] as const;

type AgeGroupType = (typeof ageGroups)[number];

type SubscriptionPlan = "Monthly" | "Yearly" | null;

type SubscriptionStatus = {
  id: string;
  plan: SubscriptionPlan;
  userId: string;
  status: "free" | "active";
  startedAt: string;
  endsAt: string;
  platform: string | null;
  price: string;
  currency: string;
};

// Notification types matching backend NotificationCategory enum
type NotificationCategory =
  | "EMAIL_VERIFICATION"
  | "PASSWORD_RESET"
  | "PASSWORD_RESET_ALERT"
  | "PASSWORD_CHANGED"
  | "PIN_RESET"
  | "NEW_LOGIN"
  | "SUBSCRIPTION_REMINDER"
  | "SUBSCRIPTION_ALERT"
  | "PAYMENT_SUCCESS"
  | "PAYMENT_FAILED"
  | "NEW_STORY"
  | "FEEDBACK"
  | "STORY_FINISHED"
  | "STORY_RECOMMENDATION"
  | "WE_MISS_YOU"
  | "INCOMPLETE_STORY_REMINDER"
  | "DAILY_LISTENING_REMINDER"
  | "DAILY_CHALLENGE_REMINDER"
  | "ACHIEVEMENT_UNLOCKED"
  | "BADGE_EARNED"
  | "STREAK_MILESTONE"
  | "SCREEN_TIME_LIMIT"
  | "BEDTIME_REMINDER"
  | "WEEKLY_REPORT"
  | "SYSTEM_ALERT";

type Notification = {
  id: string;
  userId: string;
  category: NotificationCategory;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  isRead: boolean;
  createdAt: string;
};

type NotificationsResponse = {
  notifications: Notification[];
  total: number;
};

type StoryQuota = {
  baseLimit: number;
  bonusStories: number;
  isPremium: boolean;
  remaining: number;
  totalAllowed: number;
  unlimited: boolean;
  used: number;
};

type DeviceTokenResponse = {
  id: string;
  userId: string;
  token: string;
  platform: "ios" | "android" | "web";
  deviceName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type LibraryStory = Pick<
  Story,
  | "id"
  | "title"
  | "description"
  | "coverImageUrl"
  | "textContent"
  | "ageMin"
  | "ageMax"
  | "durationSeconds"
  | "createdAt"
  | "categories"
> & { progress: number; totalTimeSpent: number; lastAccessed: string };

export type {
  User,
  Profile,
  KidType,
  QueryResponse,
  SystemAvatar,
  UserProfile,
  KidProfile,
  WeeklyReport,
  KidReport,
  ValidParentControlsRoutes,
  StoryModes,
  LearningExpectation,
  Story,
  ChildStoryStatus,
  StoryBuddy,
  AgeGroupType,
  FavouriteStory,
  AvailableVoices,
  PaginatedData,
  SubscriptionPlan,
  SubscriptionStatus,
  NotificationCategory,
  Notification,
  NotificationsResponse,
  DeviceTokenResponse,
  StoryQuota,
  LibraryStory,
};
export { ageGroups };
