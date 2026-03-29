import { useQuery, useQueryClient } from "@tanstack/react-query";
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

/** Extended cache type with failure metadata for remount rehydration */
type CachedBatchData = BatchStoryAudioResponse & {
  _failedParagraphs?: number[];
  _batchError?: string | null;
};

const useBatchStoryAudio = (storyId: string, voiceId: string | null) => {
  const queryClient = useQueryClient();
  const [batchJobId, setBatchJobId] = useState<string | null>(null);
  const [mergedParagraphs, setMergedParagraphs] = useState<
    BatchParagraph[] | null
  >(null);
  const mergedParagraphsRef = useRef<BatchParagraph[] | null>(null);
  const [failedParagraphs, setFailedParagraphs] = useState<number[]>([]);
  const [batchError, setBatchError] = useState<string | null>(null);
  // Keep ref in sync with state for reading outside setters
  useEffect(() => {
    mergedParagraphsRef.current = mergedParagraphs;
  }, [mergedParagraphs]);

  const prevVoiceRef = useRef<string | null>(voiceId);
  const lastInitializedBatchIdRef = useRef<string | null>(null);
  const lastDataUpdatedAtRef = useRef<number>(0);

  // Reset state when voice changes
  useEffect(() => {
    if (voiceId !== prevVoiceRef.current) {
      prevVoiceRef.current = voiceId;
      setBatchJobId(null);
      setMergedParagraphs(null);
      setFailedParagraphs([]);
      setBatchError(null);
      lastInitializedBatchIdRef.current = null;
      lastDataUpdatedAtRef.current = 0;
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
  // Only seed once per unique batch response — use ref to prevent re-initialization
  // after batchJobId is cleared on completion. Gate on dataUpdatedAt to avoid
  // re-seeding stale cached data after retryFailed() clears local state.
  useEffect(() => {
    if (
      batchQuery.data &&
      batchQuery.dataUpdatedAt > lastDataUpdatedAtRef.current
    ) {
      const newJobId = batchQuery.data.batchJobId ?? null;
      if (
        mergedParagraphs === null ||
        (newJobId && newJobId !== lastInitializedBatchIdRef.current)
      ) {
        lastDataUpdatedAtRef.current = batchQuery.dataUpdatedAt;
        setMergedParagraphs(batchQuery.data.paragraphs);
        setBatchJobId(newJobId);
        lastInitializedBatchIdRef.current = newJobId;
        // Rehydrate or clear failed paragraphs and batch error from cache
        const cached = batchQuery.data as CachedBatchData;
        setFailedParagraphs(
          cached._failedParagraphs?.length ? cached._failedParagraphs : []
        );
        setBatchError(cached._batchError ?? null);
      }
    }
  }, [batchQuery.data, batchQuery.dataUpdatedAt, mergedParagraphs]);

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

  // Merge newly completed paragraphs into the list.
  // Returns the merged result synchronously so callers can pass it to syncToCache.
  const mergeParagraphs = useCallback(
    (statusData: BatchStatusResponse): BatchParagraph[] | null => {
      const prev = mergedParagraphsRef.current;
      if (!prev) return null;

      const updated = [...prev];
      let changed = false;

      for (const completed of statusData.completedParagraphs) {
        const existingIdx = updated.findIndex(
          (p) => p.index === completed.index
        );
        if (existingIdx !== -1 && !updated[existingIdx].audioUrl) {
          updated[existingIdx] = {
            ...updated[existingIdx],
            audioUrl: completed.audioUrl,
          };
          changed = true;
        } else if (existingIdx === -1) {
          const originalParagraph = batchQuery.data?.paragraphs.find(
            (p) => p.index === completed.index
          );
          if (!originalParagraph) {
            // eslint-disable-next-line no-console -- legitimate runtime diagnostic for missing paragraph data
            console.warn(
              `[useBatchStoryAudio] No original paragraph found for index ${completed.index}`
            );
          }
          updated.push({
            index: completed.index,
            text: originalParagraph?.text ?? "",
            audioUrl: completed.audioUrl,
          });
          changed = true;
        }
      }

      const result = changed ? updated.sort((a, b) => a.index - b.index) : prev;
      mergedParagraphsRef.current = result;
      setMergedParagraphs(result);
      return result;
    },
    [batchQuery.data?.paragraphs]
  );

  // Sync merged paragraphs back to query cache so remounts get complete data
  const syncToCache = useCallback(
    (paragraphs: BatchParagraph[], failed: number[], error: string | null) => {
      const queryKey = ["batchStoryAudio", storyId, voiceId];
      queryClient.setQueryData<QueryResponse<CachedBatchData>>(
        queryKey,
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              paragraphs,
              batchJobId: undefined,
              pendingParagraphs: 0,
              _failedParagraphs: failed.length > 0 ? failed : undefined,
              _batchError: error ?? undefined,
            },
          };
        }
      );
    },
    [queryClient, storyId, voiceId]
  );

  useEffect(() => {
    if (pollingQuery.data) {
      const merged = mergeParagraphs(pollingQuery.data);

      // Always sync failed paragraphs from poll (clears if backend retries succeeded)
      setFailedParagraphs(pollingQuery.data.failedParagraphs ?? []);

      // Capture error message on failure
      if (pollingQuery.data.status === "failed" && pollingQuery.data.error) {
        setBatchError(pollingQuery.data.error);
      }

      // Stop polling when batch is done and sync final state to cache
      if (
        pollingQuery.data.status === "completed" ||
        pollingQuery.data.status === "failed"
      ) {
        setBatchJobId(null);
        if (merged) {
          syncToCache(
            merged,
            pollingQuery.data.failedParagraphs ?? [],
            pollingQuery.data.status === "failed"
              ? (pollingQuery.data.error ?? null)
              : null
          );
        }
      }
    }
  }, [pollingQuery.data, mergeParagraphs, syncToCache]);

  // Stop polling only on terminal errors (404 = expired batch)
  // Transient failures (5xx, network) are retried by TanStack Query
  useEffect(() => {
    if (pollingQuery.isError && pollingQuery.error) {
      const message = pollingQuery.error.message ?? "";
      const lower = message.toLowerCase();
      const isTerminal = lower.includes("404") || lower.includes("not found");
      if (isTerminal) {
        setBatchJobId(null);
      }
    }
  }, [pollingQuery.isError, pollingQuery.error]);

  const retryFailed = useCallback(() => {
    setFailedParagraphs([]);
    setBatchError(null);
    setMergedParagraphs(null);
    setBatchJobId(null);
    lastInitializedBatchIdRef.current = null;
    // Don't reset lastDataUpdatedAtRef — invalidateQueries will trigger a fresh
    // fetch with a new dataUpdatedAt, which naturally passes the guard in the
    // seeding effect. Resetting to 0 would cause stale cached data to re-seed.
    queryClient.invalidateQueries({
      queryKey: ["batchStoryAudio", storyId, voiceId],
    });
  }, [queryClient, storyId, voiceId]);

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
    failedParagraphs,
    retryFailed,
    batchError,
  };
};

export default useBatchStoryAudio;

const fetchBatchAudio = async (storyId: string, voiceId: string) => {
  try {
    console.log(`fetchBatchAudio called with storyId: ${storyId}, voiceId: ${voiceId}`);
    const request = await apiFetch(`${BASE_URL}/voice/story/audio/batch`, {
      method: "POST",
      body: JSON.stringify({ storyId, voiceId }),
    });
    const response: QueryResponse<BatchStoryAudioResponse> =
      await request.json();
    if (!response.success) throw new Error(response.message);
    return response;
  } catch (err) {
    console.error(`fetchBatchAudio error:`, err);
    throw new Error(getErrorMessage(err));
  }
};

const fetchBatchStatus = async (
  batchJobId: string
): Promise<BatchStatusResponse> => {
  const request = await apiFetch(
    `${BASE_URL}/voice/story/audio/batch/status/${batchJobId}`
  );
  if (!request.ok) {
    throw new Error(`${request.status}: ${request.statusText}`);
  }
  const response: QueryResponse<BatchStatusResponse> = await request.json();
  if (!response.success) throw new Error(response.message);
  return response.data;
};
