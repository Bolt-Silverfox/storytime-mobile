import { queryOptions, useQueryClient } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL, QUERY_KEYS } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";
import { QueryResponse, Story } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";

const useGetStory = (storyId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return queryOptions({
    queryKey: ["story", storyId, user?.id],
    queryFn: async () => {
      try {
        const request = await apiFetch(`${BASE_URL}/stories/${storyId}`, {
          method: "GET",
        });
        const response: QueryResponse<Story> = await request.json();

        if (response.statusCode === 403) {
          return null;
        }
        if (!response.success) throw new Error(response.message);
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_STORY_QUOTA, user?.id],
        });
        return response;
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
    staleTime: Infinity,
    select: (res) => res?.data ?? null,
  });
};

export default useGetStory;
