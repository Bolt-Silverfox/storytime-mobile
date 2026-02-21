import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL, QUERY_KEYS } from "../../../constants";
import apiFetch from "../../../apiFetch";
import { Alert } from "react-native";

const useSetStoryProgress = ({
  storyId,
  onSuccess,
}: {
  storyId: string;
  onSuccess?: () => void;
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
      const url = `${BASE_URL}/stories/user/progress`;
      const sessionTime = Math.floor((Date.now() - time) / 1000);

      const request = await apiFetch(url, {
        method: "POST",
        body: JSON.stringify({
          storyId: storyId,
          progress: progress,
          completed: completed,
          sessionTime: sessionTime,
        }),
      });
      const response = await request.json();
      if (!response.success) {
        throw new Error(response.message ?? "Unexpected error, try again");
      }
      return response;
    },
    onError: (err: Error) => {
      Alert.alert(err.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["storyProgress", storyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["library", "ongoingStories"],
      });
      queryClient.invalidateQueries({
        queryKey: ["library", "completedStories"],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_STORY_QUOTA],
      });
      onSuccess?.();
    },
  });
};

export default useSetStoryProgress;
