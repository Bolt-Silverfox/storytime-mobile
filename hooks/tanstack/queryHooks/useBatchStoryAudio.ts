import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";

type BatchParagraph = {
  index: number;
  text: string;
  audioUrl: string | null;
};

type BatchStoryAudioResponse = {
  paragraphs: BatchParagraph[];
  totalParagraphs: number;
  voiceId: string;
};

const useBatchStoryAudio = (storyId: string, voiceId: string | null) => {
  return useQuery({
    queryKey: ["batchStoryAudio", storyId, voiceId],
    staleTime: Infinity,
    enabled: !!storyId && !!voiceId,
    queryFn: () => fetchBatchAudio(storyId, voiceId!),
    select: (res) => res?.data,
  });
};

export default useBatchStoryAudio;

const fetchBatchAudio = async (storyId: string, voiceId: string) => {
  try {
    const request = await apiFetch(`${BASE_URL}/voice/story/audio/batch`, {
      method: "POST",
      body: JSON.stringify({ storyId, voiceId }),
    });
    const response: QueryResponse<BatchStoryAudioResponse> =
      await request.json();
    if (!response.success) throw new Error(response.message);
    return response;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
};
