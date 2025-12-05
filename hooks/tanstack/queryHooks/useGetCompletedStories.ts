import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";

export type ContinueReading = {
  title: string;
  description: string;
  language: string;
  themeIds: string[];
  categoryIds: string[];
  coverImageUrl: string;
  audioUrl: string;
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
};

type Response = {
  data: ContinueReading[];
  message: string;
  statusCode: number;
  success: boolean;
};

const useGetCompletedStories = (kidId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["completedStories", user?.id],
    queryFn: async () => {
      try {
        if (!user) return null;
        const url = `${BASE_URL}/stories/library/${kidId}/completed`;
        const response = await apiFetch(url, {
          method: "GET",
        });

        if (!response.ok) {
          const errJson = await response.json().catch(() => null);
          const msg =
            errJson?.message || `Failed with status ${response.status}`;
          throw new Error(msg);
        }

        const stories: Response = await response.json();
        console.log("stories:", stories);
        return stories; // replace `any` with your Story type if available
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

export default useGetCompletedStories;
