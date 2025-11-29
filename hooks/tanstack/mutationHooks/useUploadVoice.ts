import { useMutation } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { Alert } from "react-native";

const useUploadVoice = ({ onSuccess }: { onSuccess?: () => void }) => {
  return useMutation({
    mutationFn: async (data: { name: string; voice: BinaryType }) => {
      const URL = `${BASE_URL}/voice/upload`;
      const request = await apiFetch(URL, {
        method: "POST",
        body: JSON.stringify(data),
      });
      const response = await request.json();
      console.log("upload voice data", response);
    },
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (err) => {
      Alert.alert(err.message ?? "Unexpected error, try again.");
    },
  });
};

export default useUploadVoice;
