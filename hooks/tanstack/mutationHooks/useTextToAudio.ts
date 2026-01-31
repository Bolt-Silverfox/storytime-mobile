import { useQuery } from "@tanstack/react-query";
import { Alert } from "react-native";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";
import useGetUserProfile from "../queryHooks/useGetUserProfile";

const useTextToAudio = (params: { content: string; voiceId: string }) => {
  const { data } = useGetUserProfile();

  const isSubscribed = data?.subscriptionStatus === "premium";
  return useQuery({
    queryKey: ["textToSpeech", params.content, params.voiceId, isSubscribed],
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
      }
    },
    staleTime: Infinity,
    select: (res) => res?.data,
  });
};

export default useTextToAudio;
