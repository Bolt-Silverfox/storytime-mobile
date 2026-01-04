import { queryOptions, useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";
import { QueryResponse, Story } from "../../../types";

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

const queryGetStory = (storyId: string) => {
  return queryOptions({
    queryKey: ["story", storyId],
    queryFn: async () => {
      try {
        const request = await apiFetch(`${BASE_URL}/stories/${storyId}`, {
          method: "GET",
        });
        const response: QueryResponse<Story> = await request.json();
        if (!response.success) throw new Error(response.message);
        return response;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Unexpected error, try again";
        throw new Error(message);
      }
    },
    staleTime: Infinity,
    select: (res) => res.data,
  });
};

export { queryGetStory };
