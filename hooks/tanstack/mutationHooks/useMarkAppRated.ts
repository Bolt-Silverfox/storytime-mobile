import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL, QUERY_KEYS } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";

/**
 * Marks the current user as having rated the app. Invalidates the user-profile
 * query so `hasRatedApp` refreshes and the prompt/profile card disappear.
 */
const useMarkAppRated = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      const request = await apiFetch(`${BASE_URL}/user/me/rate-app`, {
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

export default useMarkAppRated;
