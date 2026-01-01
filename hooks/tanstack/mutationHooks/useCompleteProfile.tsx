import { useMutation } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse } from "../../../types";
import { Alert } from "react-native";

const useCompleteProfile = ({ onSuccess }: { onSuccess: () => void }) => {
  return useMutation({
    mutationFn: (data: ExpectedInput) => completeProfile(data),
    onSuccess: () => {
      onSuccess();
    },
    onError: (err) => {
      console.error("complete profile error", err.message);
      Alert.alert(err.message);
    },
  });
};

const completeProfile = async (data: ExpectedInput) => {
  console.log("completing profile...", data);
  const { imageUri, userId, language, languageCode, learningExpectations } =
    data;
  try {
    let profileImageUrl = { url: "" };
    if (imageUri) {
      console.log("awaiting upload image api");
      profileImageUrl = await uploadImage(imageUri, userId);
    }
    const request = await apiFetch(`${BASE_URL}/auth/complete-profile`, {
      method: "POST",
      body: JSON.stringify({
        language,
        languageCode,
        learningExpectations,
        profileImageUrl: profileImageUrl.url,
      }),
    });
    const response: QueryResponse = await request.json();
    if (!response.success) throw new Error(response.message);
    if (response) console.log("complete profile response", response);
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

const uploadImage = async (
  imageUri: string,
  userId: string
): Promise<{ url: string }> => {
  try {
    console.log("uploading image...");
    const formData = new FormData();
    const filename = imageUri.split("/").pop() || "image.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("image", {
      uri: imageUri,
      name: filename,
      type: type,
    } as any);
    formData.append("userId", userId);
    const response = await apiFetch(`${BASE_URL}/avatars/upload/user`, {
      method: "POST",
      body: formData,
    });
    console.log("response", response);
    if (!response.ok) {
      if (response.status === 413) {
        throw new Error(
          "Image file is too large. Please select a smaller image or reduce quality."
        );
      }
      throw new Error("Failed to upload image");
    }

    const result = await response.json();
    console.log("upload image response ", result);
    return result;
  } catch (err: unknown) {
    console.log("upload imae function error", err);
    const message =
      err instanceof Error ? err.message : "Unexpected error, try again";
    throw new Error(message);
  }
};
