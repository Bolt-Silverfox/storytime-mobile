import { queryOptions, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiFetch, { ApiError } from "../../../apiFetch";
import { BASE_URL, QUERY_KEYS } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";
import { QueryResponse, Story } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";

const useGetStory = (storyId: string) => {
  const { user, isGuest } = useAuth();
  const queryClient = useQueryClient();

  return queryOptions({
    queryKey: ["story", storyId, user?.id],
    queryFn: async () => {
      try {
        // For guests, use a different endpoint
        if (isGuest) {
          const guestSessionId = await AsyncStorage.getItem("guestSessionId");
          const request = await apiFetch(`${BASE_URL}/guest/stories/${storyId}`, {
            method: "GET",
            headers: {
              ...(guestSessionId && { "x-guest-session-id": guestSessionId }),
            },
            passThroughStatuses: [403, 401],
          });
          const response: QueryResponse<Story> = await request.json();
          if (response.statusCode === 403) {
            throw new Error(
              response.message || "You have reached your story limit. Sign up to continue reading!"
            );
          }
          if (!response.success) throw new Error(response.message);
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_STORY_QUOTA, "guest"],
          });
          return response;
        }

        const request = await apiFetch(`${BASE_URL}/stories/${storyId}`, {
          method: "GET",
          passThroughStatuses: [403],
        });
        const response: QueryResponse<Story> = await request.json();
        if (response.statusCode === 403) {
          throw new Error(
            response.message || "You have reached your story limit. Sign up to continue reading!"
          );
        }
        if (!response.success) throw new Error(response.message);
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_STORY_QUOTA, "user"],
        });
        return response;
      } catch (err) {
        if (err instanceof ApiError) {
          throw err;
        }
        throw new Error(getErrorMessage(err));
      }
    },
    staleTime: Infinity,
    select: (res) => res?.data ?? null,
  });
};

export default useGetStory;
