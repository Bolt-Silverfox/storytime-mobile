import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";

const GENERIC_VOICE_ERROR = "Something went wrong. Please try again.";

const CRYPTIC_PATTERNS = [
  "request failed",
  "cannot read prop",
  "undefined is not",
  "typeerror",
  "networkerror",
  "syntaxerror",
  "unexpected token",
];

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
            : (response.message ?? GENERIC_VOICE_ERROR);
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
      const msgLower = (err.message || "").toLowerCase();
      const isFriendly =
        msgLower && !CRYPTIC_PATTERNS.some((p) => msgLower.includes(p));
      Alert.alert("Voice Selection", isFriendly ? err.message : GENERIC_VOICE_ERROR);
    },
  });
};

export default useSetPreferredVoice;
