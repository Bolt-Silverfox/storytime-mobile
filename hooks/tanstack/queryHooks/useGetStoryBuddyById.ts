import { queryOptions } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse, StoryBuddy } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";

const queryStoryBuddyById = (id: string) => {
  return queryOptions({
    queryKey: ["selectedBuddy", id],
    queryFn: async () => {
      try {
        const request = await apiFetch(`${BASE_URL}/story-buddies/${id}`, {
          method: "GET",
        });
        const response: QueryResponse<{ data: StoryBuddy }> =
          await request.json();
        if (!response.success) throw new Error(response.message);
        return response;
      } catch (err) {
        throw new Error(getErrorMessage(err));
      }
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    select: (res) => res.data.data,
    enabled: !!id,
  });
};

export default queryStoryBuddyById;
