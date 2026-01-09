import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse } from "../../../types";
import { uploadUserAvatar } from "../../../utils/utils";

const useCompleteProfile = ({ onSuccess }: { onSuccess: () => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ExpectedInput) => completeProfile(data),
    onSuccess: (data, variables) => {
      onSuccess();
      queryClient.invalidateQueries({
        queryKey: ["userProfile", variables.userId],
      });
    },
    onError: (err) => {
      Alert.alert(err.message);
    },
  });
};

const completeProfile = async (data: ExpectedInput) => {
  const { imageUri, userId, language, languageCode, learningExpectations } =
    data;
  try {
    if (imageUri) {
      await uploadUserAvatar(imageUri, userId);
    }

    const request = await apiFetch(`${BASE_URL}/auth/complete-profile`, {
      method: "POST",
      body: JSON.stringify({
        language,
        languageCode,
        learningExpectations,
      }),
    });
    const response: QueryResponse = await request.json();
    if (!response.success) throw new Error(response.message);
    return response;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error, try again";
    throw new Error(message);
  }
};

type ExpectedInput = {
  language?: string;
  learningExpectations?: string[];
  languageCode?: string;
  imageUri?: string;
  userId: string;
};

export default useCompleteProfile;
