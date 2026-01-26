import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { Alert } from "react-native";

const useRemoveStoryFromLibrary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (storyId: string) => {
      const url = `${BASE_URL}/stories/user/library/remove/${storyId}`;

      const response = await apiFetch(url, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => null);
        throw new Error(
          errJson?.message || `Failed with status ${response.status}`
        );
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library", "ongoingStories"] });
      queryClient.invalidateQueries({ queryKey: ["library", "completedStories"] });

    },
    onError: (error: Error) => {
      Alert.alert(error.message || "Failed to remove story from library");
    },
  });
};

export default useRemoveStoryFromLibrary;
