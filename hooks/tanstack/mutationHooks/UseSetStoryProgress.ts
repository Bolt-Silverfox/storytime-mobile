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
  const { user, isGuest } = useAuth();

  return useMutation({
    mutationFn: async ({
      progress,
      completed,
      time: _time,
    }: {
      progress?: number;
      completed?: boolean;
      time?: number; // Optional - only used for guest analytics
    }) => {
      // Use guest endpoint for guests, user endpoint for authenticated users
      const url = isGuest
        ? `${BASE_URL}/guest/progress`
        : `${BASE_URL}/stories/user/progress`;

      // Note: time parameter is preserved for future analytics but not currently sent
      // Guest sessions don't persist session time to backend
      const body = isGuest
        ? { storyId, progress }
        : { storyId, progress, completed };

      const request = await apiFetch(url, {
        method: "POST",
        body: JSON.stringify(body),
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
        queryKey: [QUERY_KEYS.GET_INFINITE_STORIES],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_STORY_PROGRESS, storyId],
      });
      onSuccess?.();
    },
  });
};

export default useSetStoryProgress;
