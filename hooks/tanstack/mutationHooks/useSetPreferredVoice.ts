import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";

const useSetPreferredVoice = ({ onSuccess }: { onSuccess: () => void }) => {
  return useMutation({
    mutationFn: async (voiceId: string) => {
      const URL = `${BASE_URL}/voices/preferred`;
      const request = await apiFetch(URL, {
        method: "PATCH",
        body: JSON.stringify({ voiceId }),
      });
      return request;
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (err) => {
      Alert.alert(err.message ?? "Unexpected error, try again later");
    },
  });
};

export default useSetPreferredVoice;
