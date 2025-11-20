export interface UserData {
  name: string;
  avatar: string;
}

export interface Story {
  id: number;
  title: string;
  category: string;
  progress: number;
  coverColor: string;
  image: string;
  childName: string;
}

export interface Category {
  id: number;
  name: string;
  color: string;
}

export type StoryId = number;
export type CategoryId = number;