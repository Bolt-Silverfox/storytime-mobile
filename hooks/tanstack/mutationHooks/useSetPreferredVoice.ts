import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";
import { sanitizeUserFacingMessage } from "../../../utils/errorMessages";

const GENERIC_VOICE_ERROR = "Something went wrong. Please try again.";

const useSetPreferredVoice = () => {
  const queryClient = useQueryClient();
  const { isGuest } = useAuth();

  return useMutation({
    mutationFn: async (voiceId: string) => {
      // Guests: the UI already restricts to the default voice, so just no-op
      if (isGuest) {
        if (__DEV__ && voiceId) {
          // eslint-disable-next-line no-console
          console.warn(`Guest voice mutation called with voiceId: ${voiceId}`);
        }
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
      Alert.alert(
        "Voice Selection",
        sanitizeUserFacingMessage(err.message, GENERIC_VOICE_ERROR)
      );
    },
  });
};

export default useSetPreferredVoice;
