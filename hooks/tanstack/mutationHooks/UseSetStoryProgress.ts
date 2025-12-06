import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../../../constants";
import apiFetch from "../../../apiFetch";
import { Alert } from "react-native";

const useSetStoryProgress = ({
  kidId,
  storyId,
  onSuccess,
  id,
}: {
  kidId: string;
  storyId: string;
  onSuccess?: () => void;
  id?: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      progress,
      completed,
      time,
    }: {
      progress?: number;
      completed?: boolean;
      time: number;
    }) => {
      const url = `${BASE_URL}/stories/progress`;
      const sessionTime = Math.floor((Date.now() - time) / 1000);

      const request = await apiFetch(url, {
        method: "POST",
        body: JSON.stringify({
          kidId: kidId,
          storyId: storyId,
          progress: progress,
          completed: completed,
          sessionTime: sessionTime,
        }),
      });
      const response = await request.json();
      if (!response.success) {
        Alert.alert(response.message ?? "Unexpected error, try again");
        return;
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["storyProgress", kidId, storyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["ContinueReading", kidId],
      });
      onSuccess?.();
    },
  });
};

export default useSetStoryProgress;
