import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../../../constants";
import apiFetch from "../../../apiFetch";
import { useNavigation } from "@react-navigation/native";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import { Alert } from "react-native";
import { kidsProfileNavigatorProp } from "../../../Navigation/KidsProfileNavigator";

export const useAssignKidAvatar = (kidId: string) => {
  const navigator = useNavigation<kidsProfileNavigatorProp>();
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
        queryKey: ["kidAvatar", kidId],
      });
      navigator.navigate("indexPage");
    },
    onError: (err) => {
      console.log(err);
      Alert.alert("could not Assign Avatar");
    },
  });
};
