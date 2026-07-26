import { useMutation } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { CancelStoryJobResponse } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";

/**
 * Cancel an in-flight story generation job.
 *
 * DELETE /stories/generate/jobs/:jobId → { cancelled, reason? }
 */
const useCancelStoryJob = () => {
  return useMutation({
    mutationFn: async (jobId: string): Promise<CancelStoryJobResponse> => {
      const url = `${BASE_URL}/stories/generate/jobs/${jobId}`;
      const response = await apiFetch(url, {
        method: "DELETE",
      }).catch((err) => {
        throw new Error(getErrorMessage(err));
      });
      const data: CancelStoryJobResponse = await response.json();
      return data;
    },
  });
};

export default useCancelStoryJob;
