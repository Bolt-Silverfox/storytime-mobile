import { queryOptions } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse, StoryBuddy } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";

const queryGetStoryBuddies = () => {
  return queryOptions({
    queryFn: async () => {
      try {
        const request = await apiFetch(`${BASE_URL}/story-buddies/active`, {
          method: "GET",
        });
        const response: QueryResponse<{ data: StoryBuddy[] }> =
          await request.json();
        if (!response.success) throw new Error(response.message);
        return response;
      } catch (err) {
        throw new Error(getErrorMessage(err));
      }
    },
    queryKey: ["storyBuddies"],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    select: (res) => res.data.data,
  });
};

export default queryGetStoryBuddies;
