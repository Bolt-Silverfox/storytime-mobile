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
      const request = await apiFetch(`${BASE_URL}/auth/kids/${kidsIds[0]}`, {
        method: "DELETE",
      });
      const response = await request.json();

      if (!response.success) {
        throw new Error(response.message ?? "Unexpected error, try again");
      }
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
