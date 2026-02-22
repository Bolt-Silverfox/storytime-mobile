import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";

const useTextToAudio = (params: {
  content: string;
  voiceId: string;
  storyId: string;
}) => {
  return useQuery({
    queryKey: ["textToSpeech", params.storyId, params.content, params.voiceId],
    staleTime: Infinity,
    enabled: !!params.content && !!params.voiceId && !!params.storyId,
    queryFn: async () =>
      await textToSpeech(params.voiceId, params.content, params.storyId),
    select: (res) => res?.data,
  });
};

export default useTextToAudio;

const textToSpeech = async (
  voiceId: string,
  content: string,
  storyId: string
) => {
  try {
    const request = await apiFetch(`${BASE_URL}/voice/story/audio`, {
      method: "POST",
      body: JSON.stringify({ content, voiceId, storyId }),
    });
    const response: QueryResponse<{ audioUrl: string; voiceId: string }> =
      await request.json();
    if (!response.success) throw new Error(response.message);
    return response;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
};
