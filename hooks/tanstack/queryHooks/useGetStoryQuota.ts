import { queryOptions, useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL, QUERY_KEYS } from "../../../constants";
import { QueryResponse, StoryQuota } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";

const queryStoryQuota = () =>
  queryOptions({
    queryKey: [QUERY_KEYS.GET_STORY_QUOTA],
    queryFn: async () => {
      try {
        const request = await apiFetch(`${BASE_URL}/stories/user/quota`, {
          method: "GET",
        });
        const response: QueryResponse<StoryQuota> = await request.json();
        if (!response.success) throw new Error(response.message);
        return response;
      } catch (err) {
        throw new Error(getErrorMessage(err));
      }
    },
    staleTime: 5 * 60 * 1000,
    select: (res) => res.data,
  });

const useGetStoryQuota = () => useQuery(queryStoryQuota());

export { queryStoryQuota };
export default useGetStoryQuota;
