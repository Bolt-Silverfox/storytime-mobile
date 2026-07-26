import { queryOptions, useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { StoryJobStatus, StoryJobStatusResponse } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";

/** Job states that mean the queue is done working (stop polling). */
const TERMINAL_STATUSES: StoryJobStatus[] = [
  "completed",
  "failed",
  "cancelled",
];

const isTerminal = (status?: StoryJobStatus) =>
  !!status && TERMINAL_STATUSES.includes(status);

const storyJobStatusQuery = (jobId: string, enabled: boolean) =>
  queryOptions({
    queryKey: ["storyJobStatus", jobId],
    queryFn: async (): Promise<StoryJobStatusResponse> => {
      const url = `${BASE_URL}/stories/generate/jobs/${jobId}`;
      const request = await apiFetch(url, { method: "GET" }).catch((err) => {
        throw new Error(getErrorMessage(err));
      });
      return (await request.json()) as StoryJobStatusResponse;
    },
    enabled: enabled && !!jobId,
    // Poll ~3s as an SSE fallback; stop once the job reaches a terminal state.
    refetchInterval: (query) =>
      isTerminal(query.state.data?.status) ? false : 3000,
    staleTime: 0,
    gcTime: 0,
  });

/**
 * Poll GET /stories/generate/jobs/:jobId as a fallback for the live SSE stream.
 * Pass `enabled: false` while SSE is healthy to avoid duplicate traffic.
 */
const useStoryJobStatus = (jobId: string, enabled: boolean) =>
  useQuery(storyJobStatusQuery(jobId, enabled));

export { storyJobStatusQuery, isTerminal, TERMINAL_STATUSES };
export default useStoryJobStatus;
