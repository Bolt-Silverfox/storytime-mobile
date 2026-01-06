import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse } from "../../../types";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    // let profileImageUrl = { url: "" };
    if (imageUri) {
      await uploadImage(imageUri, userId);
    }

    const request = await apiFetch(`${BASE_URL}/auth/complete-profile`, {
      method: "POST",
      body: JSON.stringify({
        language,
        languageCode,
        learningExpectations,
        // profileImageUrl: profileImageUrl.url,
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

const uploadImage = async (imageUri: string, userId: string) => {
  // no need to return the url for the image cos it updates the user's avatar directly on the backend.
  try {
    const token = await AsyncStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg",
      name: "avatar.jpg",
    } as any);
    formData.append("userId", userId);
    const request = await fetch(`${BASE_URL}/avatars/upload/user`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
