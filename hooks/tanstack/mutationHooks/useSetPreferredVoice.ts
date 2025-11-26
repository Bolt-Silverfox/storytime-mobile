import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import { BASE_URL } from "../../../constants";
import apiFetch from "../../../apiFetch";
import { useNavigation } from "@react-navigation/native";
import { ParentControlNavigatorProp } from "../../../Navigation/ParentControlsNavigator";

const useSetPreferredVoice = () => {
  const navigator = useNavigation<ParentControlNavigatorProp>();

  return useMutation({
    mutationFn: async (voiceId: string) => {
      const URL = `${BASE_URL}/stories/voices/preferred`;
      const request = await apiFetch(URL, {
        method: "PATCH",
        body: JSON.stringify({ voiceId }),
      });
      return request;
    },
    onSuccess: () => {
      navigator.reset({
        index: 0,
        routes: [{ name: "successScreen" }],
      });
    },
    onError: (err) => {
      Alert.alert(err.message ?? "Unexpected error, try again later");
    },
  });
};

export default useSetPreferredVoice;
