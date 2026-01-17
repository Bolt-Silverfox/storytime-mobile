import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage, uploadUserAvatar } from "../../../utils/utils";
import useAuth from "../../../contexts/AuthContext";
import { Alert } from "react-native";

const useUploadCustomAvatar = ({ onSuccess }: { onSuccess: () => void }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (imageUri: string) => {
      const response = await uploadUserAvatar(imageUri, user?.id!);
      console.log("uplaod response", response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userProfile", user?.id],
      });
      onSuccess();
    },
    onError: (err) => {
      Alert.alert("Failed to upload avatar", getErrorMessage(err));
    },
  });
};

export default useUploadCustomAvatar;
