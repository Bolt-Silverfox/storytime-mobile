import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";

type VoiceAccess = {
  isPremium: boolean;
  unlimited: boolean;
  defaultVoice: string;
  maxVoices: number;
  lockedVoiceId: string | null;
  elevenLabsTrialStoryId: string | null;
};

const useGetVoiceAccess = () => {
  return useQuery({
    queryKey: ["voiceAccess"],
    queryFn: async () => {
      try {
        const request = await apiFetch(`${BASE_URL}/voice/access`, {
          method: "GET",
        });
        const response: QueryResponse<VoiceAccess> = await request.json();
        if (!response.success) throw new Error(response.message);
        return response;
      } catch (err) {
        throw new Error(getErrorMessage(err));
      }
    },
    staleTime: 30_000,
    select: (res) => res.data,
  });
};

export type { VoiceAccess };
export default useGetVoiceAccess;
