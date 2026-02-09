import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";
import { Story } from "../../../types";

type OngoingStory = Pick<
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
