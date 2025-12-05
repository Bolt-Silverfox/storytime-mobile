import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";

type ParentFavoriteResponse = {
  success: boolean;
  message?: string;
  data?: any;
};

const useDeleteParentFavorite = (redirect?: () => void) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (storyId: string | number) => {
      if (!user?.id) {
        throw new Error("You must be logged in as a parent.");
      }
      if (!storyId) {
        throw new Error("storyId is required.");
      }

      const url = `${BASE_URL}/parent-favorites/${storyId}`;
      console.log("🗑️ Deleting favorite at:", url);

      const response = await apiFetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      console.log("📥 Raw response:", response);
      const json: ParentFavoriteResponse = await response
        .json()
        .catch(() => ({ success: false, message: "Invalid response" }));

      console.log("📥 Parsed JSON:", json);

      if (!response.ok || !json?.success) {
        console.log("❌ Error response:", json);
        throw new Error(json?.message || `Request failed: ${response.status}`);
      }

      return json;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parentFavorites"] });

      if (redirect) redirect();
    },

    onError: (err: any) => {
      const message = err instanceof Error ? err.message : String(err);
      Alert.alert(message);
    },
  });
};

export default useDeleteParentFavorite;
