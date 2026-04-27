import { queryOptions, useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL, QUERY_KEYS } from "../../../constants";
import { QueryResponse, StoryQuota } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";
import useAuth from "../../../contexts/AuthContext";

const queryStoryQuota = (isGuest: boolean) =>
  queryOptions({
    queryKey: [QUERY_KEYS.GET_STORY_QUOTA, isGuest ? "guest" : "user"],
    queryFn: async () => {
      // Use guest endpoint for guests, user endpoint for authenticated users
      const url = isGuest
        ? `${BASE_URL}/guest/quota`
        : `${BASE_URL}/stories/user/quota`;
      const request = await apiFetch(url, {
        method: "GET",
      }).catch((err) => {
        throw new Error(getErrorMessage(err));
      });
      const response: QueryResponse<StoryQuota> = await request.json();
      if (!response.success) throw new Error(response.message);
      return response;
    },
    staleTime: 30_000,
    select: (res) => res.data,
  });

const useGetStoryQuota = () => {
  const { isGuest } = useAuth();
  return useQuery(queryStoryQuota(isGuest));
};

export { queryStoryQuota };
export default useGetStoryQuota;
