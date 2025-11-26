import { useNavigation } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";

const useUpdateKids = () => {
  const queryClient = useQueryClient();
  const navigator = useNavigation<ParentProfileNavigatorProp>();

  return useMutation({
    mutationFn: async (kids: {
      id: string;
      name: string;
      ageRange: string;
    }) => {
      const request = await apiFetch(`${BASE_URL}/auth/kids/${kids.id}`, {
        method: "PUT",
        body: JSON.stringify({ name: kids.name, ageRange: kids.ageRange }),
      });
      const results = await request.json();
      if (!results.success) {
        throw new Error(results.message);
      }
      console.log("update kids result", results);
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userKids"],
      });
      navigator.navigate("manageChildProfiles");
    },
    onError: (err) => {
      Alert.alert(err.message);
    },
  });
};

export default useUpdateKids;
