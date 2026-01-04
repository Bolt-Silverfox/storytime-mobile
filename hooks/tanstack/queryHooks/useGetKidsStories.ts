import { queryOptions } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { ChildStoryStatus, QueryResponse, Story } from "../../../types";

const queryGetKidsStories = (kidId: string, category: ChildStoryStatus) => {
  let url = `${BASE_URL}/stories/library/${kidId}/completed`;
  if (category === "ongoing") {
    url = `${BASE_URL}/stories/library/${kidId}/continue-reading`;
  }
  return queryOptions({
    queryKey: [category, kidId],
    queryFn: async () => {
      try {
        const request = await apiFetch(`${url}`, {
          method: "GET",
        });
        const response: QueryResponse<Story[]> = await request.json();
        if (!response.success) throw new Error(response.message);
        return response;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unexpected error";
        throw new Error(message);
      }
    },
    staleTime: Infinity,
    select: (res) => res.data,
  });
};

export default queryGetKidsStories;
