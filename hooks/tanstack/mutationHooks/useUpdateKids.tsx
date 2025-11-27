import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";

const useUpdateKids = ({
  id,
  onSuccess,
}: {
  id: string;
  onSuccess?: () => void | null;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (kids: {
      name?: string;
      ageRange?: string;
      excludedTags?: string[];
    }) => {
      // const bedTimeDays = kids.bedtimeDays
      //   ? getBedtimeDaysByString(kids.bedtimeDays[0])
      //   : [0];
      const request = await apiFetch(`${BASE_URL}/auth/kids/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: kids.name,
          ageRange: kids.ageRange,
          excludedTags: kids.excludedTags,
          // bedTimeDays,
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
      queryClient.invalidateQueries({
        queryKey: ["kidById", id],
      });
      onSuccess?.();
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
