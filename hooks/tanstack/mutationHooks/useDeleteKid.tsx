import { useNavigation } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";

const useDeleteKid = () => {
  const queryClient = useQueryClient();
  const navigator = useNavigation<ParentProfileNavigatorProp>();
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
        queryKey: ["userKids"],
      });
      navigator.reset({
        index: 0,
        routes: [{ name: "deleteProfileSucessful" }],
      });
    },
    onError: (err) => {
      Alert.alert(err.message);
    },
  });
};

export default useDeleteKid;
