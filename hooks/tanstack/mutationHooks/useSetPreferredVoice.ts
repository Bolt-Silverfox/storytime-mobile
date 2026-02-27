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
        passThroughStatuses: [400, 403, 404],
      });
      const response = await request.json();
      if (!response.success) {
        const msg =
          request.status === 403
            ? "You've already selected a voice. Upgrade to premium to switch voices."
            : (response.message ?? "Something went wrong. Please try again.");
        throw new Error(msg);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["preferredVoice"] });
      queryClient.invalidateQueries({ queryKey: ["voiceAccess"] });
    },
    onError: (err: Error) => {
      queryClient.invalidateQueries({ queryKey: ["voiceAccess"] });
      const crypticPatterns = [
        "Request failed",
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
        : "Something went wrong. Please try again.";
      Alert.alert("Voice Selection", message);
    },
  });
};

export default useSetPreferredVoice;
