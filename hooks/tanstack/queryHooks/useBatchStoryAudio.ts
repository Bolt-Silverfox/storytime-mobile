import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";

export type BatchParagraph = {
  index: number;
  text: string;
  audioUrl: string | null;
};

export type BatchStoryAudioResponse = {
  paragraphs: BatchParagraph[];
  totalParagraphs: number;
  wasTruncated: boolean;
  voiceId: string;
  usedProvider?: "elevenlabs" | "deepgram" | "edgetts" | "none";
  /** Present only when the backend fell back to a different provider.
   *  Its presence signals degraded audio quality — the requested provider was unavailable. */
  preferredProvider?: "elevenlabs" | "deepgram" | "edgetts";
};

const useBatchStoryAudio = (storyId: string, voiceId: string | null) => {
  return useQuery({
    queryKey: ["batchStoryAudio", storyId, voiceId],
    staleTime: 1000 * 60 * 30, // 30 min — audio URLs are permanent (Cloudinary) but avoid stale paragraph lists
    gcTime: 1000 * 60 * 60, // 1 hour — keep in memory to avoid redundant batch requests
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
