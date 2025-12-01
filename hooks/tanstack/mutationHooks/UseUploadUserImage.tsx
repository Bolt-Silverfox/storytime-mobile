import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../../../constants";
import apiFetch from "../../../apiFetch";
import { useNavigation } from "@react-navigation/native";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import { Alert } from "react-native";

export const useUploadImage = (userId: string, redirect?: () => void) => {
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (imageUri: string): Promise<{ url: string }> => {
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

      if (!response.ok) {
        if (response.status === 413) {
          throw new Error(
            "Image file is too large. Please select a smaller image or reduce quality."
          );
        }
        throw new Error("Failed to upload image");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userProfile", userId],
      });
      redirect?.();
    },
    onError: () => {
      Alert.alert("Could not upload file ");
    },
  });
};
