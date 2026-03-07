import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";

export type BatchParagraph = {
  index: number;
  text: string;
  audioUrl: string | null;
};

export type AudioProvider = "elevenlabs" | "deepgram" | "edgetts";

export type BatchStoryAudioResponse = {
  paragraphs: BatchParagraph[];
  totalParagraphs: number;
  wasTruncated: boolean;
  voiceId: string;
  usedProvider?: AudioProvider | "none";
  /** Present only when the backend fell back to a different provider. */
  preferredProvider?: AudioProvider;
  /** Present when background generation is queued */
  batchJobId?: string;
  /** Count of paragraphs still generating in background */
  pendingParagraphs?: number;
};

export type BatchStatusResponse = {
  status: "processing" | "completed" | "failed";
  completedParagraphs: Array<{ index: number; audioUrl: string }>;
  failedParagraphs: number[];
  totalQueued: number;
  error?: string;
};

const useBatchStoryAudio = (storyId: string, voiceId: string | null) => {
  const [batchJobId, setBatchJobId] = useState<string | null>(null);
  const [mergedParagraphs, setMergedParagraphs] = useState<
    BatchParagraph[] | null
  >(null);
  const prevVoiceRef = useRef<string | null>(voiceId);

  // Reset state when voice changes
  useEffect(() => {
    if (voiceId !== prevVoiceRef.current) {
      prevVoiceRef.current = voiceId;
      setBatchJobId(null);
      setMergedParagraphs(null);
    }
  }, [voiceId]);

  // Phase 1: Initial batch fetch
  const batchQuery = useQuery({
    queryKey: ["batchStoryAudio", storyId, voiceId],
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    enabled: !!storyId && !!voiceId,
    queryFn: () => fetchBatchAudio(storyId, voiceId!),
    select: (res) => res?.data,
  });

  // When batch response arrives, capture batchJobId and initialize merged paragraphs
  // Only reset if this is initial load or a genuinely new batch (prevents refetch overwrites)
  useEffect(() => {
    if (batchQuery.data) {
      const newJobId = batchQuery.data.batchJobId ?? null;
      if (mergedParagraphs === null || newJobId !== batchJobId) {
        setMergedParagraphs(batchQuery.data.paragraphs);
        setBatchJobId(newJobId);
      }
    }
  }, [batchQuery.data, mergedParagraphs, batchJobId]);

  // Phase 2: Poll for completed paragraphs
  const pollingQuery = useQuery({
    queryKey: ["batchStatus", batchJobId],
    enabled: !!batchJobId,
    queryFn: () => fetchBatchStatus(batchJobId!),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "completed" || status === "failed") return false;
      return 3000;
    },
    staleTime: 0,
    gcTime: 0,
    structuralSharing: false,
  });

  // Merge newly completed paragraphs into the list
  const mergeParagraphs = useCallback(
    (statusData: BatchStatusResponse) => {
      setMergedParagraphs((prev) => {
        if (!prev) return prev;

        const updated = [...prev];
        let changed = false;

        for (const completed of statusData.completedParagraphs) {
          const existingIdx = updated.findIndex(
            (p) => p.index === completed.index,
          );
          if (existingIdx !== -1 && !updated[existingIdx].audioUrl) {
            updated[existingIdx] = {
              ...updated[existingIdx],
              audioUrl: completed.audioUrl,
            };
            changed = true;
          } else if (existingIdx === -1) {
            // Look up original text from the initial batch response
            const originalParagraph = batchQuery.data?.paragraphs.find(
              (p) => p.index === completed.index,
            );
            updated.push({
              index: completed.index,
              text: originalParagraph?.text ?? "",
              audioUrl: completed.audioUrl,
            });
            changed = true;
          }
        }

        return changed ? updated.sort((a, b) => a.index - b.index) : prev;
      });
    },
    [batchQuery.data?.paragraphs],
  );

  useEffect(() => {
    if (pollingQuery.data) {
      mergeParagraphs(pollingQuery.data);

      // Stop polling when batch is done
      if (
        pollingQuery.data.status === "completed" ||
        pollingQuery.data.status === "failed"
      ) {
        setBatchJobId(null);
      }
    }
  }, [pollingQuery.data, mergeParagraphs]);

  // Stop polling on 404 (expired batch)
  useEffect(() => {
    if (pollingQuery.isError) {
      setBatchJobId(null);
    }
  }, [pollingQuery.isError]);

  // Build the final data object with merged paragraphs
  const data = batchQuery.data
    ? {
        ...batchQuery.data,
        paragraphs: mergedParagraphs ?? batchQuery.data.paragraphs,
      }
    : undefined;

  return {
    data,
    isLoading: batchQuery.isLoading,
    isError: batchQuery.isError,
    isStillGenerating: !!batchJobId,
    pollingError: pollingQuery.error,
  };
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

const fetchBatchStatus = async (
  batchJobId: string,
): Promise<BatchStatusResponse> => {
  try {
    const request = await apiFetch(
      `${BASE_URL}/voice/story/audio/batch/status/${batchJobId}`,
    );
    const response: QueryResponse<BatchStatusResponse> =
      await request.json();
    if (!response.success) throw new Error(response.message);
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
};
