import { useMutation } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { GenerateStoryInput, GenerateStoryJobResponse } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";

/**
 * Enqueue an AI story generation job.
 *
 * POST /stories/generate/async → { queued, jobId, estimatedWaitTime?, error? }
 * (HTTP 202). The mobile app has no kid context, so callers omit `kidId` and
 * generate a generic story from the supplied themes/categories/age/etc.
 */
const useGenerateStoryAsync = () => {
  return useMutation({
    mutationFn: async (
      input: GenerateStoryInput
    ): Promise<GenerateStoryJobResponse> => {
      const url = `${BASE_URL}/stories/generate/async`;
      const response = await apiFetch(url, {
        method: "POST",
        body: JSON.stringify(input),
      }).catch((err) => {
        throw new Error(getErrorMessage(err));
      });
      const data: GenerateStoryJobResponse = await response.json();
      if (!data?.jobId || data.queued === false) {
        throw new Error(
          data?.error ?? "We couldn't start your story. Please try again."
        );
      }
      return data;
    },
  });
};

export default useGenerateStoryAsync;
