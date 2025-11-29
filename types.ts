type QueryResponse<T> = {
  success: boolean;
  mesage: string;
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
  avatar: string | null;
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

export type {
  User,
  Profile,
  KidType,
  QueryResponse,
  SystemAvatar,
  UserProfile,
  KidProfile,
};
