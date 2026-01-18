import { useQuery } from "@tanstack/react-query";
import { Alert } from "react-native";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";

const useTextToAudio = (params: { content: string; voiceType: string }) => {
  return useQuery({
    queryKey: ["textToSpeech", params.content, params.voiceType],
    queryFn: async () => {
      try {
        const request = await apiFetch(`${BASE_URL}/voice/story/audio`, {
          method: "POST",
          body: JSON.stringify(params),
        });
        const response: QueryResponse<{ audioUrl: string; voiceType: string }> =
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
