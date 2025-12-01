import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../../../constants";
import apiFetch from "../../../apiFetch";
import { Alert } from "react-native";

const useSetStoryBuddy = ({
  kidId,
  onSuccess,
  id,
}: {
  kidId: string;
  id: string;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      console.log("kid id", kidId);
      console.log("selected", id);
      const url = `${BASE_URL}/story-buddies/kids/${kidId}/select`;
      const request = await apiFetch(url, {
        method: "POST",
        body: JSON.stringify({ buddyId: id }),
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
        queryKey: ["kidById", kidId],
      });
      queryClient.invalidateQueries({
        queryKey: ["storyBuddies"],
      });
      queryClient.invalidateQueries({
        queryKey: ["selectedBuddy", id],
      });
      onSuccess?.();
    },
  });
};

export default useSetStoryBuddy;
