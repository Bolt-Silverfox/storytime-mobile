import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";

const useDeleteKid = () => {
  const queryClient = useQueryClient();
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (kidsIds: Array<string>) => {
      const request = apiFetch(`${BASE_URL}/auth/kids`, {
        method: "DELETE",
        body: JSON.stringify(kidsIds),
      });
      return request;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userKids", user?.id],
      });
      navigator.navigate("deleteProfileSucessful");
    },
    onError: (err) => {
      Alert.alert(err.message);
    },
  });
};

export default useDeleteKid;
