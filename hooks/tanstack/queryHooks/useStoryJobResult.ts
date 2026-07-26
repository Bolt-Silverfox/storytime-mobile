import { queryOptions, useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { getErrorMessage } from "../../../utils/utils";

/**
 * Pull a story id out of the /result payload. The endpoint returns the
 * generated story once ready (bare or wrapped in a `{ data }` envelope), or
 * `{ jobId, ready: false, status }` while still pending. Returns null until a
 * story id is resolvable.
 */
const extractStoryId = (raw: unknown): string | null => {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  if (record.ready === false) return null;
  const story = (record.data ?? record) as Record<string, unknown>;
  const id = story.id ?? story.storyId;
  return typeof id === "string" ? id : null;
};

const storyJobResultQuery = (jobId: string, enabled: boolean) =>
  queryOptions({
    queryKey: ["storyJobResult", jobId],
    queryFn: async (): Promise<{ storyId: string | null }> => {
      const url = `${BASE_URL}/stories/generate/jobs/${jobId}/result`;
      const request = await apiFetch(url, { method: "GET" }).catch((err) => {
        throw new Error(getErrorMessage(err));
      });
      const raw: unknown = await request.json();
      return { storyId: extractStoryId(raw) };
    },
    enabled: enabled && !!jobId,
    // Keep retrying briefly in case the result lands a beat after "completed".
    refetchInterval: (query) => (query.state.data?.storyId ? false : 2000),
    staleTime: 0,
    gcTime: 0,
  });

/**
 * Fetch GET /stories/generate/jobs/:jobId/result to finalize a completed job
 * when the SSE `completed` event's storyId isn't available (poll fallback).
 */
const useStoryJobResult = (jobId: string, enabled: boolean) =>
  useQuery(storyJobResultQuery(jobId, enabled));

export { storyJobResultQuery, extractStoryId };
export default useStoryJobResult;
