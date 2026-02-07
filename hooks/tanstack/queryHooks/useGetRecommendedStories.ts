import { queryOptions } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse, Story } from "../../../types";

const queryRecommendedStories = (userId: string | null | undefined) => {
  return queryOptions({
    queryKey: ["recommendedStoriesForParents", userId],
    queryFn: async () => {
      try {
        const request = await apiFetch(`${BASE_URL}/stories?recommended=true`, {
          method: "GET",
        });
        const response: QueryResponse<{ data: Story[] }> = await request.json();
        if (!response.success) throw new Error(response.message);
        return response;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Unexpected error, try again";
        throw new Error(message);
      }
    },
    staleTime: Infinity,
    select: (res) => res.data.data,
    gcTime: 1000 * 60 * 60 * 10,
    enabled: !!userId,
  });
};

export { queryRecommendedStories };
