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
      preferredVoiceId?: string;
      preferredCategoryIds?: string[];
      isBedtimeEnabled?: boolean;
      bedtimeStart?: string;
      bedtimeEnd?: string;
      bedtimeDays?: number[];
      dailyScreenTimeLimitMins?: number | null;
      bedtimeLockApp?: boolean;
      bedtimeDimScreen?: boolean;
      bedtimeReminder?: boolean;
      bedtimeStoriesOnly?: boolean;
    }) => {
      console.log("update kids data", kids);
      console.log("kid data", id);
      const request = await apiFetch(`${BASE_URL}/auth/kids/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: kids.name,
          ageRange: kids.ageRange,
          excludedTags: kids.excludedTags,
          preferredVoiceId: kids.preferredVoiceId,
          preferredCategoryIds: kids.preferredCategoryIds,
          isBedtimeEnabled: kids.isBedtimeEnabled,
          bedtimeStart: kids.bedtimeStart,
          bedtimeEnd: kids.bedtimeEnd,
          bedtimeDays: kids.bedtimeDays,
          dailyScreenTimeLimitMins: kids.dailyScreenTimeLimitMins,
          bedtimeLockApp: kids.bedtimeLockApp,
          bedtimeDimScreen: kids.bedtimeDimScreen,
          bedtimeReminder: kids.bedtimeReminder,
          bedtimeStoriesOnly: kids.bedtimeStoriesOnly,
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

// pnpm run generate
// pnpm start
