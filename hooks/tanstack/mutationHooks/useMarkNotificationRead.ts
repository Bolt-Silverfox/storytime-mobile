import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { getErrorMessage } from "../../../utils/utils";
import { notifLogger } from "../../../utils/logger";

const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await apiFetch(`${BASE_URL}/notifications/mark-read`, {
        method: "PATCH",
        body: JSON.stringify({ notificationIds: [notificationId] }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to mark notification as read (HTTP ${response.status})`
        );
      }

      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (err) => {
      notifLogger.error("Mark read error:", getErrorMessage(err));
    },
  });
};

export default useMarkNotificationRead;
