import { queryOptions, useQueryClient } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL, QUERY_KEYS } from "../../../constants";
import { QueryResponse, Story } from "../../../types";
import useAuth from "../../../contexts/AuthContext";
import { getErrorMessage } from "../../../utils/utils";

const useGetStory = (storyId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return queryOptions({
    queryKey: ["story", storyId],
    queryFn: async () => {
      try {
        const request = await apiFetch(`${BASE_URL}/stories/${storyId}`, {
          method: "GET",
        });
        const response: QueryResponse<Story> = await request.json();
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_STORIES_QUOTA, user?.id],
        });
        if (!response.success) throw new Error(response.message);
        return response;
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
    staleTime: Infinity,
    select: (res) => res.data,
  });
};

export default useGetStory;
