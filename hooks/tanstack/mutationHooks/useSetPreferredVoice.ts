import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";

const useSetPreferredVoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (voiceId: string) => {
      const request = await apiFetch(`${BASE_URL}/voice/preferred`, {
        method: "PATCH",
        body: JSON.stringify({ voiceId }),
      });
      const response = await request.json();
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["preferredVoice"] });
      queryClient.invalidateQueries({ queryKey: ["voiceAccess"] });
    },
    onError: (err) => {
      Alert.alert(err.message ?? "Unexpected error, try again later");
    },
  });
};

export default useSetPreferredVoice;
