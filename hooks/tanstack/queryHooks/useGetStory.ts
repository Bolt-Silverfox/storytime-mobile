import { queryOptions, useQueryClient } from "@tanstack/react-query";
import apiFetch, { ApiError } from "../../../apiFetch";
import { BASE_URL, QUERY_KEYS } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";
import { QueryResponse, Story } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";

type UseGetStoryOptions = {
  /** Consume a guest story slot for a brand-new read. */
  consumeGuestAccess?: boolean;
  /**
   * The guest has already read this story, so opening it is a free re-read.
   * Routes through the guest endpoint (which serves already-read stories
   * without consuming quota) instead of the quota-guarded /stories/:id route.
   */
  guestAlreadyRead?: boolean;
};

const useGetStory = (
  storyId: string,
  {
    consumeGuestAccess = true,
    guestAlreadyRead = false,
  }: UseGetStoryOptions = {}
) => {
  const { user, isGuest } = useAuth();
  const queryClient = useQueryClient();

  // Use the guest endpoint whenever we intend to consume a slot OR the story
  // has already been read (free re-read). Only a not-yet-read preview (e.g. a
  // deep link opening the detail screen) falls through to /stories/:id, which
  // checks quota without consuming.
  const useGuestEndpoint = isGuest && (consumeGuestAccess || guestAlreadyRead);

  return queryOptions({
    queryKey: [
      "story",
      storyId,
      isGuest ? "guest" : "user",
      user?.id ?? null,
      useGuestEndpoint ? "guest-endpoint" : "preview",
    ],
    queryFn: async () => {
      try {
        // Guest re-read or consuming read -> guest endpoint (already-read
        // stories are served free; new reads consume a slot server-side).
        if (useGuestEndpoint) {
          const url = `${BASE_URL}/guest/stories/${storyId}`;
          const request = await apiFetch(url, {
            method: "GET",
            passThroughStatuses: [403, 401],
          });
          const response: QueryResponse<Story> = await request.json();
          if (response.statusCode === 403) {
            throw new Error(
              response.message ||
                "You have reached your story limit. Sign up to continue reading!"
            );
          }
          if (!response.success) throw new Error(response.message);
          if (consumeGuestAccess) {
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.GET_STORY_QUOTA, "guest"],
            });
          }
          return response;
        }

        const request = await apiFetch(`${BASE_URL}/stories/${storyId}`, {
          method: "GET",
          passThroughStatuses: [403],
        });
        const response: QueryResponse<Story> = await request.json();
        if (response.statusCode === 403) {
          throw new Error(
            response.message ||
              "You have reached your story limit. Sign up to continue reading!"
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
