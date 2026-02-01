import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";

export type FeedbackPayload = {
  fullname: string;
  email: string;
  message: string;
};

const useSubmitFeedback = (options?: {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}) => {
  return useMutation({
    mutationFn: async (data: FeedbackPayload) => {
      const response = await apiFetch(`${BASE_URL}/help-support/feedback`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to send feedback");
      }
      return result;
    },
    onSuccess: () => {
      options?.onSuccess?.();
    },
    onError: (err: Error) => {
      const message = err.message ?? "Something went wrong";
      if (options?.onError) {
        options.onError(message);
      } else {
        Alert.alert("Error", message);
      }
    },
  });
};

export default useSubmitFeedback;
