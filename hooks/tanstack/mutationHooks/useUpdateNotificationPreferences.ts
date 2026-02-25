import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import apiFetch, { ApiError } from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";
import { QueryResponse } from "../../../types";
import { NotificationPreferences } from "../queryHooks/useGetNotificationPreferences";

const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const queryKey = ["notificationPreferences", user?.id];

  return useMutation({
    mutationFn: async (preferences: Record<string, boolean>) => {
      const request = await apiFetch(
        `${BASE_URL}/users/me/notification-preferences`,
        {
          method: "PATCH",
          body: JSON.stringify(preferences),
        }
      );
      const response: QueryResponse<NotificationPreferences> =
        await request.json();
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onMutate: async (newPreferences) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData =
        queryClient.getQueryData<NotificationPreferences>(queryKey);

      queryClient.setQueryData<NotificationPreferences>(queryKey, (old) => {
        if (!old) return old;
        const updated = { ...old };
        for (const [category, enabled] of Object.entries(newPreferences)) {
          const existing = updated[category] ?? {
            push: true,
            in_app: true,
          };
          updated[category] = { ...existing, push: enabled };
        }
        return updated;
      });

      return { previousData };
    },
    onSuccess: (data) => {
      // Sync cache with the actual server state so preferences persist
      // across app restarts and after staleTime expires.
      queryClient.setQueryData(queryKey, data);
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
          : (err.message ?? "Unexpected error, try again later")
      );
    },
  });
};

export default useUpdateNotificationPreferences;
