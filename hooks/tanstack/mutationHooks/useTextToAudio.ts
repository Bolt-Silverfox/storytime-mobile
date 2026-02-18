import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";
import useGetUserProfile from "../queryHooks/useGetUserProfile";

const useTextToAudio = (params: { content: string; voiceId: string }) => {
  const { data } = useGetUserProfile();

  const isSubscribed =
    data?.subscriptionStatus === "active" || data?.role === "admin";

  return useQuery({
    queryKey: ["textToSpeech", params.content, params.voiceId, isSubscribed],
    staleTime: Infinity,
    enabled: !!params.content,
    queryFn: async () =>
      await textToSpeech(params.voiceId, params.content, isSubscribed),
    select: (res) => res?.data,
  });
};

export default useTextToAudio;

const textToSpeech = async (
  voiceId: string,
  content: string,
  isSubscribed: boolean
) => {
  if (!isSubscribed) return { data: { audioUrl: null, voiceId: null } };
  try {
    const request = await apiFetch(`${BASE_URL}/voice/story/audio`, {
      method: "POST",
      body: JSON.stringify({ content, voiceId }),
    });
    const response: QueryResponse<{ audioUrl: string; voiceId: string }> =
      await request.json();
    if (!response.success) throw new Error(response.message);
    return response;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
};
