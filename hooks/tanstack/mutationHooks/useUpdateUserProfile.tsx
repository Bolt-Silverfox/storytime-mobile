import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ProfileNavigatorProp } from "../../../Navigation/ProfileNavigator";

const useUpdateUserProfile = (numOfKids: number) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const navigation = useNavigation<ProfileNavigatorProp>();
  return useMutation({
    mutationFn: async (data: {
      name?: string;
      avatarUrl?: string;
      language?: string;
      country?: string;
      title?: string;
    }) => {
      const response = await apiFetch(`${BASE_URL}/user/${user?.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userProfile", user?.id],
      });
      navigation.navigate("kidsInfoForm", { kidsCount: numOfKids });
    },
    onError: (err) => {
      Alert.alert(err.message);
    },
  });
};

export default useUpdateUserProfile;
