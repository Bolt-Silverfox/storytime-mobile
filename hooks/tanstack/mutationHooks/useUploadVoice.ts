import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { Alert } from "react-native";

const useUploadVoice = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; file: string }) => {
      const URL = `${BASE_URL}/voice/upload`;
      const request = await apiFetch(URL, {
        method: "POST",
        body: JSON.stringify(data),
      });
      const response = await request.json();
      if (!response.success) {
        throw new Error(response.message ?? "Unexpected error, try again");
      }
      console.log("upload voice data", response);
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: ["voices"],
      });
    },
    onError: (err) => {
      Alert.alert(err.message ?? "Unexpected error, try again.");
    },
  });
};

export default useUploadVoice;
