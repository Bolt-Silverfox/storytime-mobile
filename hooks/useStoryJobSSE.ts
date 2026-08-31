import { useEffect, useRef, useState } from "react";
import EventSource from "react-native-sse";
import { BASE_URL } from "../constants";
import { StoryJobSSEEvent } from "../types";
import { secureTokenStorage } from "../utils/secureTokenStorage";
import { apiLogger } from "../utils/logger";

type SSEPhase = "connecting" | "progress" | "completed" | "failed";

/** Named SSE events emitted by the backend (NestJS sets `type` as the event name). */
type JobEventName = "progress" | "completed" | "failed" | "heartbeat";

type UseStoryJobSSEResult = {
  progress: number;
  progressMessage?: string;
  status: SSEPhase;
  storyId?: string;
  error?: string;
  /** True once the stream errored, so callers can fall back to polling. */
  sseFailed: boolean;
};

/**
 * Subscribe to live job progress over Server-Sent Events.
 *
 * Opens an EventSource to GET /events/jobs/:jobId with a bearer token (SSE
 * can't go through apiFetch, so we read the access token directly). Parses each
 * event's JSON `data`, ignores heartbeats, and closes on completed/failed or
 * unmount. On connection error it flips `sseFailed` so the caller can poll the
 * status endpoint instead.
 */
const useStoryJobSSE = (jobId: string | null): UseStoryJobSSEResult => {
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState<string | undefined>();
  const [status, setStatus] = useState<SSEPhase>("connecting");
  const [storyId, setStoryId] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [sseFailed, setSseFailed] = useState(false);

  // Keep a live ref so the async setup can bail if the effect already tore down.
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!jobId) return;

    cancelledRef.current = false;
    let es: EventSource<JobEventName> | null = null;

    const connect = async () => {
      const token = await secureTokenStorage.getAccessToken();
      if (cancelledRef.current) return;

      if (!token) {
        setSseFailed(true);
        return;
      }

      // The backend (NestJS @Sse) sets each event's `type` as the SSE event
      // NAME — so events arrive as `event: progress|completed|failed|heartbeat`,
      // NOT the default "message". We route every named event (plus an unnamed
      // "message" fallback) through one handler that keys off the payload's own
      // `type` field, which is also present in the JSON data.
      es = new EventSource<JobEventName>(`${BASE_URL}/events/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
        // The backend closes the stream on completion; don't auto-reconnect.
        pollingInterval: 0,
      });

      const handlePayload = (data: string | null | undefined) => {
        if (!data) return;
        let payload: StoryJobSSEEvent;
        try {
          payload = JSON.parse(data) as StoryJobSSEEvent;
        } catch {
          return;
        }

        if (payload.type === "heartbeat") return;

        if (typeof payload.progress === "number") {
          setProgress(payload.progress);
        }
        if (payload.progressMessage !== undefined) {
          setProgressMessage(payload.progressMessage);
        }

        if (payload.type === "completed") {
          setStatus("completed");
          if (payload.result?.storyId) setStoryId(payload.result.storyId);
          es?.close();
        } else if (payload.type === "failed") {
          setStatus("failed");
          setError(
            payload.error ?? "Story generation failed. Please try again."
          );
          es?.close();
        } else {
          setStatus("progress");
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
        apiLogger.warn("Story job SSE error, falling back to polling:", event);
        setSseFailed(true);
      });
    };

    connect().catch((err) => {
      apiLogger.warn("Story job SSE setup failed:", err);
      setSseFailed(true);
    });

    return () => {
      cancelledRef.current = true;
      es?.removeAllEventListeners();
      es?.close();
    };
  }, [jobId]);

  return { progress, progressMessage, status, storyId, error, sseFailed };
};

export default useStoryJobSSE;
