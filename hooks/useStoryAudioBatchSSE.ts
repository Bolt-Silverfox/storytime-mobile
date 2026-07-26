import { useEffect, useRef, useState } from "react";
import EventSource from "react-native-sse";
import { BASE_URL } from "../constants";
import { secureTokenStorage } from "../utils/secureTokenStorage";
import { audioLogger } from "../utils/logger";

/** Named SSE events emitted by the backend (NestJS sets `type` as the event name). */
type JobEventName = "progress" | "completed" | "failed" | "heartbeat";

type VoiceJobPayload = {
  type: JobEventName;
  jobType?: "story" | "voice";
  progress?: number;
  result?: {
    paragraphIndex?: number;
    audioUrl?: string;
    totalParagraphs?: number;
    completedParagraphs?: number;
    failedParagraphs?: number;
  };
  error?: string;
};

export type BatchSSEStatus = "connecting" | "processing" | "completed" | "failed";

export type UseStoryAudioBatchSSEResult = {
  /** Paragraphs whose audio has been delivered over the stream so far. */
  completedParagraphs: Array<{ index: number; audioUrl: string }>;
  status: BatchSSEStatus;
  /** Total paragraphs in the batch, reported on the terminal `completed` event. */
  totalParagraphs?: number;
  /** Failed-paragraph count from the terminal `completed` event (indices unknown here). */
  failedCount?: number;
  error?: string;
  /** True once the stream errors, so callers can fall back to polling. */
  sseFailed: boolean;
};

/**
 * Subscribe to a background TTS batch over Server-Sent Events.
 *
 * Opens an EventSource to GET /events/jobs/:batchJobId (same stream story
 * generation uses; the backend TtsBatchProcessor emits `progress` per ready
 * paragraph and a terminal `completed`/`failed`). Replaces the old 3s status
 * polling. On connection error it flips `sseFailed` so the caller can poll the
 * status endpoint as a fallback.
 */
const useStoryAudioBatchSSE = (
  batchJobId: string | null
): UseStoryAudioBatchSSEResult => {
  const [completedParagraphs, setCompletedParagraphs] = useState<
    Array<{ index: number; audioUrl: string }>
  >([]);
  const [status, setStatus] = useState<BatchSSEStatus>("connecting");
  const [totalParagraphs, setTotalParagraphs] = useState<number | undefined>();
  const [failedCount, setFailedCount] = useState<number | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [sseFailed, setSseFailed] = useState(false);

  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!batchJobId) return;

    cancelledRef.current = false;
    // Reset per-batch state so a new batchJobId starts clean.
    setCompletedParagraphs([]);
    setStatus("connecting");
    setTotalParagraphs(undefined);
    setFailedCount(undefined);
    setError(undefined);
    setSseFailed(false);

    let es: EventSource<JobEventName> | null = null;

    const connect = async () => {
      const token = await secureTokenStorage.getAccessToken();
      if (cancelledRef.current) return;

      if (!token) {
        setSseFailed(true);
        return;
      }

      es = new EventSource<JobEventName>(
        `${BASE_URL}/events/jobs/${batchJobId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          // The backend closes the stream on completion; don't auto-reconnect.
          pollingInterval: 0,
        }
      );

      const handlePayload = (data: string | null | undefined) => {
        if (!data) return;
        let payload: VoiceJobPayload;
        try {
          payload = JSON.parse(data) as VoiceJobPayload;
        } catch {
          return;
        }

        if (payload.type === "heartbeat") return;

        if (payload.type === "progress") {
          const index = payload.result?.paragraphIndex;
          const audioUrl = payload.result?.audioUrl;
          if (typeof index === "number" && typeof audioUrl === "string") {
            setCompletedParagraphs((prev) =>
              prev.some((p) => p.index === index)
                ? prev
                : [...prev, { index, audioUrl }]
            );
          }
          setStatus("processing");
        } else if (payload.type === "completed") {
          if (typeof payload.result?.totalParagraphs === "number") {
            setTotalParagraphs(payload.result.totalParagraphs);
          }
          if (typeof payload.result?.failedParagraphs === "number") {
            setFailedCount(payload.result.failedParagraphs);
          }
          setStatus("completed");
          es?.close();
        } else if (payload.type === "failed") {
          setError(payload.error ?? "Audio generation failed.");
          setStatus("failed");
          es?.close();
        }
      };

      const namedEvents: JobEventName[] = [
        "progress",
        "completed",
        "failed",
        "heartbeat",
      ];
      namedEvents.forEach((name) => {
        es?.addEventListener(name, (event) => {
          handlePayload((event as { data?: string | null }).data);
        });
      });
      // Fallback for a server that emits unnamed events.
      es.addEventListener("message", (event) => handlePayload(event.data));

      es.addEventListener("error", (event) => {
        audioLogger.warn(
          "Batch audio SSE error, falling back to polling:",
          event
        );
        setSseFailed(true);
      });
    };

    connect().catch((err) => {
      audioLogger.warn("Batch audio SSE setup failed:", err);
      setSseFailed(true);
    });

    return () => {
      cancelledRef.current = true;
      es?.removeAllEventListeners();
      es?.close();
    };
  }, [batchJobId]);

  return {
    completedParagraphs,
    status,
    totalParagraphs,
    failedCount,
    error,
    sseFailed,
  };
};

export default useStoryAudioBatchSSE;
