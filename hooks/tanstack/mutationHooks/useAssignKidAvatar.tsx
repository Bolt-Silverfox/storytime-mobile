import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";

export const useAssignKidAvatar = (kidId: string, redirect?: () => void) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (avatarId: string) => {
      console.log(avatarId, kidId);
      const response = await apiFetch(`${BASE_URL}/avatars/assign/kid`, {
        method: "POST",
        body: JSON.stringify({ kidId, avatarId }),
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["kidById", kidId],
      });
      queryClient.invalidateQueries({
        queryKey: ["userKids", user?.id],
      });
      redirect?.();
    },
    onError: (err) => {
      console.log(err);
      Alert.alert("could not Assign Avatar");
    },
  });
};
