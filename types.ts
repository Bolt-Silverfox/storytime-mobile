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
  avatar: Avatar | null;
  createdAt: string;
  email: string;
  enableBiometrics: boolean;
  id: string;
  name: string;
  numberOfKids: number;
  pinSet: boolean;
  profile: {
    country: string;
    explicitContent: boolean;
    language: string;
    maxScreenTimeMins: null | string | number;
  };
  role: string;
  title: string;
  updatedAt: string;
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
  recommend: boolean;
  aiGenerated: boolean;
  difficultyLevel: number;
  wordCount: number;
  durationSeconds: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
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
    imae: string | null;
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

type FavouriteStory = {
  id: string;
  storyId: string;
  title: string;
  description: string;
  coverImageUrl: string;
  createdAt: string;
  ageRange: string;
};

const ageGroups = ["1-3", "4-6", "7-9", "10-12"] as const;

type AgeGroupType = (typeof ageGroups)[number];
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
};
export { ageGroups };
