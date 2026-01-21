import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";

export type OngoingStory = {
  id: string;
  title: string;
  description: string;
  language: string;
  themeIds: string[];
  categoryIds: string[];
  seasonIds: string[];
  coverImageUrl: string;
  audioUrl: string;
  textContent: string;
  isInteractive: boolean;
  ageMin: number;
  ageMax: number;
  images: {
    url: string;
    caption: string;
  }[];
  branches: {
    prompt: string;
    optionA: string;
    optionB: string;
    nextA: string;
    nextB: string;
  }[];
  durationSeconds: number;
  createdAt: string;
  updatedAt: string;
  progress: number;
  totalTimeSpent: number;
  lastAccessed: string;
};

export type Response = {
  data: OngoingStory[];
  message: string;
  statusCode: number;
  success: boolean;
};


const useGetOngoingStories = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["library", "ongoingStories"],
    queryFn: async () => {
      try {
        if (!user) return null;

        const url = `${BASE_URL}/stories/user/library/continue-reading`;
        const response = await apiFetch(url, {
          method: "GET",
        });

        if (!response.ok) {
          const errJson = await response.json().catch(() => null);
          throw new Error(
            errJson?.message || `Failed with status ${response.status}`
          );
        }

        const ongoingStories: Response = await response.json();
        console.log("ongoing stories:", ongoingStories);
        return ongoingStories;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "unexpected error, try again";
        throw new Error(message);
      }
    },
    select: (data) => data?.data,
    enabled: !!user,
  });
};

export default useGetOngoingStories;
