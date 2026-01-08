import { queryOptions } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse, Story } from "../../../types";

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

export default queryGetStory;
