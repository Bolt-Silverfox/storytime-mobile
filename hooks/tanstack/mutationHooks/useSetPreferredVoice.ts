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
        passThroughStatuses: [403],
      });
      const response = await request.json();
      if (!response.success) {
        const msg =
          request.status === 403
            ? "You've already selected a voice. Upgrade to premium to switch voices."
            : (response.message ?? "Unexpected error, try again later");
        throw new Error(msg);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["preferredVoice"] });
      queryClient.invalidateQueries({ queryKey: ["voiceAccess"] });
    },
    onError: (err) => {
      queryClient.invalidateQueries({ queryKey: ["voiceAccess"] });
      Alert.alert("Voice Selection", err.message);
    },
  });
};

export default useSetPreferredVoice;
