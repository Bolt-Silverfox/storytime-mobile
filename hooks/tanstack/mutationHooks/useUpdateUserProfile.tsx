import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";

const useUpdateUserProfile = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name?: string;
      avatarUrl?: string;
      language?: string;
      country?: string;
      title?: string;
    }) => {
      const response = await apiFetch(`${BASE_URL}/auth/profile`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userProfile", user?.id],
      });
      onSuccess?.();
    },
    onError: (err) => {
      Alert.alert(err.message);
    },
  });
};

export default useUpdateUserProfile;
