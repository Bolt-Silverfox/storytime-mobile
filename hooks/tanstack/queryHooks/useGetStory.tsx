import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";

const useGetStory = (storyId?: string | null) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["story", storyId],
    queryFn: async () => {
      try {
        if (!storyId) return null;
        if (!user) return null;

        const url = `${BASE_URL}/stories/${storyId}`;
        const response = await apiFetch(url, {
          method: "GET",
        });

        if (!response.ok) {
          const errJson = await response.json().catch(() => null);
          const msg = errJson?.message || `Failed with status ${response.status}`;
          throw new Error(msg);
        }

        const story = await response.json();
        console.log("story data:", story);
        return story;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "unexpected error, try again";
        throw new Error(message);
      }
    },
    enabled: !!storyId && !!user, // prevent running when empty
  });
};

export default useGetStory;
