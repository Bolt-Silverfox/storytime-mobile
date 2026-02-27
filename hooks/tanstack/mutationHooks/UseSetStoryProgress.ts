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
      const crypticPatterns = [
        "Cannot read prop",
        "undefined is not",
        "TypeError",
        "NetworkError",
        "SyntaxError",
        "Unexpected token",
      ];
      const isFriendly =
        err.message && !crypticPatterns.some((p) => err.message.includes(p));
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
      queryClient.refetchQueries({
        queryKey: ["stories"],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_STORY_PROGRESS, storyId],
      });
      onSuccess?.();
    },
  });
};

export default useSetStoryProgress;
