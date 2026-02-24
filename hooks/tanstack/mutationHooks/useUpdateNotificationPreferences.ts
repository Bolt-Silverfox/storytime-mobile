import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import apiFetch, { ApiError } from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { NotificationPreferences } from "../queryHooks/useGetNotificationPreferences";

const useUpdateNotificationPreferences = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  const queryKey = ["notificationPreferences", userId];

  return useMutation({
    mutationFn: async (preferences: Record<string, boolean>) => {
      const request = await apiFetch(
        `${BASE_URL}/users/me/notification-preferences`,
        {
          method: "PATCH",
          body: JSON.stringify(preferences),
        },
      );
      const response: NotificationPreferences = await request.json();
      return response;
    },
    onMutate: async (newPreferences) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData =
        queryClient.getQueryData<NotificationPreferences>(queryKey);

      queryClient.setQueryData<NotificationPreferences>(queryKey, (old) => {
        if (!old) return old;
        const updated = { ...old };
        for (const [category, enabled] of Object.entries(newPreferences)) {
          updated[category] = { push: enabled, in_app: enabled };
        }
        return updated;
      });

      return { previousData };
    },
    onError: (err: Error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      const is429 = err instanceof ApiError && err.status === 429;
      Alert.alert(
        "Error",
        is429
          ? "Too many changes, please wait a moment."
          : err.message ?? "Unexpected error, try again later",
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export default useUpdateNotificationPreferences;
