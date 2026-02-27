import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import apiFetch from "../../../apiFetch";
import { BASE_URL, QUERY_KEYS } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";
import { QueryResponse } from "../../../types";

const useSetStoryProgress = ({
  storyId,
  onSuccess,
}: {
  storyId: string;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

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
          sessionTime,
        }),
      });
      const response: QueryResponse = await request.json();
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onError: (err: Error) => {
      // Don't show cryptic internal errors to the user
      const isFriendly =
        err.message && !err.message.includes("Cannot read prop");
      const message = isFriendly
        ? err.message
        : "Something went wrong saving your progress. Your reading is not affected.";
      Alert.alert("Story Progress", message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_LIBRARY_STORIES, "completed", user?.id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_LIBRARY_STORIES, "ongoing", user?.id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_STORY_QUOTA],
      });
      queryClient.invalidateQueries({
        queryKey: ["stories"],
      });
      queryClient.invalidateQueries({
        queryKey: ["storyProgress", storyId],
      });
      onSuccess?.();
    },
  });
};

export default useSetStoryProgress;
