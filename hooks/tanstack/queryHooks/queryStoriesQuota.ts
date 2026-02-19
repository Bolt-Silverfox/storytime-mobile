import { queryOptions } from "@tanstack/react-query";
import { getErrorMessage } from "../../../utils/utils";
import { BASE_URL, QUERY_KEYS } from "../../../constants";
import apiFetch from "../../../apiFetch";
import { QueryResponse, StoryQuota } from "../../../types";

const queryStoriesQuota = (userId: string | null | undefined) =>
  queryOptions({
    queryFn: getStoriesQuota,
    queryKey: [QUERY_KEYS.GET_STORIES_QUOTA, userId],
    enabled: !!userId,
    gcTime: Infinity,
    staleTime: Infinity,
    select: (res) => res.data,
  });

export default queryStoriesQuota;

const getStoriesQuota = async () => {
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
};
