import { queryOptions } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse, Story as StoryType } from "../../../types";

const queryStoryByCategory = (categoryId: string) => {
  return queryOptions({
    queryKey: ["storyByCategory", categoryId],
    queryFn: async () => {
      try {
        const request = await apiFetch(
          `${BASE_URL}/stories?category=${categoryId}`,
          {
            method: "GET",
          }
        );
        const response: QueryResponse<{ data: StoryType[] }> =
          await request.json();
        if (!response.success) throw new Error(response.message);
        return response;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unexpected error";
        throw new Error(message);
      }
    },
    staleTime: Infinity,
    select: (res) => res.data.data,
  });
};

export { queryStoryByCategory };
