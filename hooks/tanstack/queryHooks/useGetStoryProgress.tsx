import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";
import { QueryResponse } from "../../../types";

export type StoryProgress = {
  id: string;
  storyId: string;
  progress: number;
  completed: boolean;
  lastAccessed: string;
  totalTimeSpent: number;
};

const useGetStoryProgress = (storyId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["storyProgress", storyId],
    queryFn: async () => {
      try {
        if (!user) return null;
        const url = `${BASE_URL}/stories/user/progress/${storyId}`;
        const response = await apiFetch(url, {
          method: "GET",
        });

        if (!response.ok) {
          const errJson = await response.json().catch(() => null);
          const msg =
            errJson?.message || `Failed with status ${response.status}`;
          throw new Error(msg);
        }

        const progress: QueryResponse<StoryProgress> = await response.json();
        return progress;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "unexpected error, try again";
        throw new Error(message);
      }
    },
    select: (data) => data?.data,
    enabled: !!user && !!storyId,
    staleTime: 1000 * 60 * 5,
  });
};

export default useGetStoryProgress;
