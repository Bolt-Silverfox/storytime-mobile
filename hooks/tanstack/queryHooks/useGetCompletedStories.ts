import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";
import type { OngoingStory, Response } from "./useGetOngoingStories";

const useGetCompletedStories = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["library", "completedStories"],
    queryFn: async () => {
      try {
        if (!user) return null;

        const url = `${BASE_URL}/stories/user/library/completed`;
        const response = await apiFetch(url, {
          method: "GET",
        });

        if (!response.ok) {
          const errJson = await response.json().catch(() => null);
          throw new Error(
            errJson?.message || `Failed with status ${response.status}`
          );
        }

        const completedStories: Response = await response.json();
        console.log("completed stories:", completedStories);
        return completedStories;
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
