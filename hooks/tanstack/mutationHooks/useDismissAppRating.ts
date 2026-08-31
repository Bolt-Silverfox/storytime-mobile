import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL, QUERY_KEYS } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";

/**
 * Records that the user dismissed the "Rate Us" prompt. Invalidates the
 * user-profile query so `rateAppDismissedAt` refreshes; the prompt then never
 * shows again and the Profile-screen rate card takes over.
 */
const useDismissAppRating = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      const request = await apiFetch(`${BASE_URL}/user/me/rate-app/dismiss`, {
        method: "PATCH",
        passThroughStatuses: [400, 403, 404],
      });
      return request.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_PROFILE, user?.id],
      });
    },
  });
};

export default useDismissAppRating;
