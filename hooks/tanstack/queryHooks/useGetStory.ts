import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";
import type { Story } from "./useGetStories"; // adjust path if needed

type SingleStoryRequest = {
  statusCode?: number;
  success?: boolean;
  data?: Story;
  message?: string;
};

const useGetStory = (storyId?: string | null) => {
  const { user } = useAuth();

  return useQuery<Story | null, Error>({
    queryKey: ["getStory", storyId],
    queryFn: async () => {
      if (!storyId) return null;

      const url = `${BASE_URL}/stories/${storyId}`;
      const response = await apiFetch(url, { method: "GET" });

      const json: SingleStoryRequest | Story | null = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        const msg =
          (json && (json as SingleStoryRequest).message) ||
          `Request failed with status ${response.status}`;
        throw new Error(msg);
      }

      if (json && typeof json === "object" && "success" in json) {
        const api = json as SingleStoryRequest;
        if (!api.success) {
          throw new Error(api.message ?? "Unexpected error from server");
        }
        return (api.data as Story) ?? null;
      }

      return (json as Story) ?? null;
    },
    enabled: !!storyId && !!user, 
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    select: (data) => data,
  });
};

export type { SingleStoryRequest };
export default useGetStory;
