import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";

const GENERIC_VOICE_ERROR = "Something went wrong. Please try again.";

// Default voice ID for guest users (VoiceType enum key)
const GUEST_DEFAULT_VOICE_ID = "NIMBUS";

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
  const { isGuest } = useAuth();

  return useMutation({
    mutationFn: async (voiceId: string) => {
      // Guests can only use the default voice
      if (isGuest) {
        if (voiceId !== GUEST_DEFAULT_VOICE_ID) {
          throw new Error(
            "Guest users can only use the default voice. Sign in to access all voices.",
          );
        }
        // For guests, voiceId should be the internal DB ID, not ElevenLabs ID
        // We allow any voiceId since the UI already restricts to default
        // Just return success without making an API call
        return { success: true };
      }

      const request = await apiFetch(`${BASE_URL}/voice/preferred`, {
        method: "PATCH",
        body: JSON.stringify({ voiceId }),
        passThroughStatuses: [400, 403, 404],
      });
      const response = await request.json();
      if (!response.success) {
        const fallbackMsg =
          request.status === 403
            ? "You've already selected a voice. Upgrade to premium to switch voices."
            : GENERIC_VOICE_ERROR;
        const msg = response.message ?? fallbackMsg;
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
      Alert.alert(
        "Voice Selection",
        isFriendly ? err.message : GENERIC_VOICE_ERROR
      );
    },
  });
};

export default useSetPreferredVoice;
