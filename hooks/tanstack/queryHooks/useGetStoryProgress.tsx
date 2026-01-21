import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";

export type StoryProgress = {
  id: string;
  storyId: string;
  progress: number;
  completed: boolean;
  lastAccessed: string;
  totalTimeSpent: number;
};

type Response = {
  data: StoryProgress;
  message: string;
  statusCode: number;
  success: boolean;
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

        const progress: Response = await response.json();
        return progress;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "unexpected error, try again";
        throw new Error(message);
      }
    },
    select: (data) => data?.data,
    enabled: !!user  && !!storyId,
  });
};

export default useGetStoryProgress;
