import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";
import { getErrorMessage } from "../../../utils/utils";

export type NotificationPreferences = Record<
  string,
  { push: boolean; in_app: boolean }
>;

const useGetNotificationPreferences = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["notificationPreferences", user?.id],
    queryFn: async () => {
      try {
        const request = await apiFetch(
          `${BASE_URL}/users/me/notification-preferences`,
          { method: "GET" }
        );
        const response: NotificationPreferences = await request.json();
        return response;
      } catch (err) {
        throw new Error(getErrorMessage(err));
      }
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });
};

export default useGetNotificationPreferences;
