import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL, QUERY_KEYS } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";
import { QueryResponse } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";

export type GuestStoryAccess = {
  canAccess: boolean;
  reason?: string;
  storiesRead: number;
  remaining: number;
  totalAllowed: number;
  alreadyRead: boolean;
};

const useGetGuestStoryAccess = (storyId: string) => {
  const { isGuest } = useAuth();

  return useQuery({
    queryKey: [QUERY_KEYS.GET_GUEST_STORY_ACCESS, storyId],
    queryFn: async () => {
      const request = await apiFetch(
        `${BASE_URL}/guest/stories/${storyId}/access`,
        {
          method: "GET",
        }
      ).catch((err) => {
        throw new Error(getErrorMessage(err));
      });
      const response: QueryResponse<GuestStoryAccess> = await request.json();
      if (!response.success) throw new Error(response.message);
      return response;
    },
    enabled: isGuest && !!storyId,
    staleTime: 0,
    gcTime: 0,
    select: (res) => res.data,
  });
};

export default useGetGuestStoryAccess;
