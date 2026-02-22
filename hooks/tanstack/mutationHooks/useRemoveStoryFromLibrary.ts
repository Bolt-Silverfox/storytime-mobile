import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL, QUERY_KEYS } from "../../../constants";
import { Alert } from "react-native";
import useAuth from "../../../contexts/AuthContext";
import { QueryResponse } from "../../../types";

const useRemoveStoryFromLibrary = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (storyId: string) => {
      const request = await apiFetch(
        `${BASE_URL}/stories/user/library/remove/${storyId}`,
        {
          method: "DELETE",
        }
      );
      const response: QueryResponse = await request.json();
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_LIBRARY_STORIES, "completed", user?.id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_LIBRARY_STORIES, "ongoing", user?.id],
      });
    },
    onError: (error: Error) => {
      Alert.alert(error.message || "Failed to remove story from library");
    },
  });
};

export default useRemoveStoryFromLibrary;
