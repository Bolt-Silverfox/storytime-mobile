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
      name?: string;
      ageRange?: string;
      isBedtimeEnabled?: boolean;
      bedtimeStart?: string;
      bedtimeEnd?: string;
      bedtimeDays?: Array<"everyday" | "weekdays" | "weekends">;
      preferredVoiceId?: string;
    }) => {
      const bedTimeDays = kids.bedtimeDays
        ? getBedtimeDaysByString(kids.bedtimeDays[0])
        : [0];
      const request = await apiFetch(`${BASE_URL}/auth/kids/${kids.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: kids.name,
          ageRange: kids.ageRange,
          // bedTimeDays,
          isBedtimeEnabled: kids.isBedtimeEnabled,
          bedtimeStart: kids.bedtimeStart,
          bedtimeEnd: kids.bedtimeEnd,
          preferredVoiceId: kids.preferredVoiceId,
        }),
      });
      const results = await request.json();
      console.log("update kids result", results);
      if (!results.success) {
        throw new Error(results.message ?? "unexpected error, try again");
      }
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

const getBedtimeDaysByString = (
  input: "everyday" | "weekdays" | "weekends"
): number[] => {
  if (input === "everyday") {
    return [0, 1, 2, 3, 4, 5, 6];
  } else if (input === "weekdays") {
    return [1, 2, 3, 4, 5];
  } else {
    return [6, 1];
  }
};
