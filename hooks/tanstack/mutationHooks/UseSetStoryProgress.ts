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
  id: string;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      progress,
      completed,
      time,
    }: {
      progress: number;
      completed: boolean;
      time: number;
    }) => {
      const url = `${BASE_URL}/stories/progress`;
      const request = await apiFetch(url, {
        method: "POST",
        body: JSON.stringify({
          kidId: kidId,
          storyId: storyId,
          progress: progress,
          completed: completed,
          sessionTime: time,
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
      onSuccess?.();
    },
  });
};

export default useSetStoryProgress;
