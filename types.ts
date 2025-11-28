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

type KidType = {
  statusCode: number;
  success: boolean;
  data: {
    id: string;
    name: string;
    avatarId: string | null;
    ageRange: string;
    parentId: string;
    createdAt: string;
    updatedAt: string;
    preferredVoiceId: null | string;
    avatar: Avatar | null;
  }[];
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



export type { User, Profile, KidType, QueryResponse, SystemAvatar };
