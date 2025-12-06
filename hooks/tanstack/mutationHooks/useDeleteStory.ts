import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../constants";
import { Alert } from "react-native";
import apiFetch from "../../../apiFetch";
import { QueryResponse } from "../../../types";

const useDeleteStory = ({
  storyId,
  onSuccess,
}: {
  storyId: string;
  onSuccess?: () => void;
}) => {
  return useMutation({
    mutationFn: async () => {
      const url = `${BASE_URL}/stories/${storyId}`;
      const request = await apiFetch(url, {
        method: "DELETE",
        body: JSON.stringify({ permanent: true }),
      });
      const response: QueryResponse = await request.json();
      if (!response.success) {
        throw new Error(response.message ?? "Unexpected error");
      }
    },
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (err) => {
      Alert.alert(err.message);
    },
  });
};

export default useDeleteStory;
