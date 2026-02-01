import { useQuery } from "@tanstack/react-query";
import { Alert } from "react-native";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { SUBSCRIPTION_STATUS, USER_ROLES } from "../../../constants/ui";
import { QueryResponse } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";
import useGetUserProfile from "../queryHooks/useGetUserProfile";

const useTextToAudio = (params: {
  content: string;
  voiceId: string;
  enabled?: boolean;
}) => {
  const { data } = useGetUserProfile();

  const isSubscribed =
    data?.subscriptionStatus === SUBSCRIPTION_STATUS.active || data?.role === USER_ROLES.admin;
  return useQuery({
    queryKey: ["textToSpeech", params.content, params.voiceId, isSubscribed],
    enabled: params.enabled !== false && isSubscribed && !!params.voiceId,
    queryFn: async () => {
      try {
        if (!isSubscribed) return { data: null };
        const request = await apiFetch(`${BASE_URL}/voice/story/audio`, {
          method: "POST",
          body: JSON.stringify(params),
        });
        const response: QueryResponse<{ audioUrl: string; voiceId: string }> =
          await request.json();
        if (!response.success) throw new Error(response.message);
        return response;
      } catch (err) {
        Alert.alert("Failed to generate audio", getErrorMessage(err));
        return { data: null };
      }
    },
    staleTime: Infinity,
    select: (res) => res?.data,
  });
};

export default useTextToAudio;
