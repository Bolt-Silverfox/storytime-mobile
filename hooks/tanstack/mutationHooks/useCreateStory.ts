import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse } from "../../../types";

const useCreateStory = ({
  kidId,
  onSuccess,
}: {
  kidId: string;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const url = `${BASE_URL}/stories/generate/kid/${kidId}`;
      const request = await apiFetch(url, {
        method: "POST",
      });
      const response: QueryResponse = await request.json();
      console.log("generate story response", response);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["generatedStories"],
      });
      onSuccess?.();
    },
    onError: (err) => {
      Alert.alert(err.message ?? "Unexpected error, try again later");
    },
  });
};

export default useCreateStory;
