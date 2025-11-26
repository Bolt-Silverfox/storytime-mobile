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
    mutationFn: async (
      kids: {
        id: string;
        name: string;
        avatarUrl: string;
        ageRange: string;
      }[]
    ) => {
      const request = await apiFetch(`${BASE_URL}/auth/kids`, {
        method: "PUT",
        body: JSON.stringify(kids),
      });
      const results = await request.json();
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
