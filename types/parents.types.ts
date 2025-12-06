import { ContinueReading } from "../hooks/tanstack/queryHooks/useGetContinueReading";

export interface UserData {
  name: string;
  avatar: string;
}
type stories = Story & ContinueReading;
export interface Story {
  id: number;
  title: string;
  category: string;
  progress: number;
  coverColor: string;
  image: string;
  childName: string;
  progBackgroundColor: string;
  color: string;
  backgroundColor: string;
}

export interface Category {
  id: number;
  name: string;
  colour: string;
  bg: string;
}

export type StoryId = number;
export type CategoryId = number;
