import { useNavigation } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";

const useRemoveFromFavorite = (kidId: string, storyId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const request = await apiFetch(
        `${BASE_URL}/stories/favorites/${kidId}/${storyId}`,
        {
          method: "DELETE",
          body: JSON.stringify({ kidId, storyId }),
        }
      );
      const response = await request.json();

      if (!response.success) {
        throw new Error(response.message ?? "Unexpected error, try again");
      }
      return request;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["kidFavorite", kidId],
      });
    },
    onError: (err) => {
      Alert.alert(err.message);
    },
  });
};

export default useRemoveFromFavorite;
