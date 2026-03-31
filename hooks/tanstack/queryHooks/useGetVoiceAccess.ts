import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";
import useAuth from "../../../contexts/AuthContext";

type VoiceAccess = {
  isPremium: boolean;
  unlimited: boolean;
  defaultVoice: string;
  maxVoices: number;
  lockedVoiceId: string | null;
  elevenLabsTrialStoryId: string | null;
  usedVoicesForStory: string[];
  maxVoicesPerStory: number;
};

const useGetVoiceAccess = (storyId?: string) => {
  const { isGuest } = useAuth();

  return useQuery({
    queryKey: ["voiceAccess", storyId ?? null],
    queryFn: async () => {
      try {
        const url = storyId
          ? `${BASE_URL}/voice/access?storyId=${encodeURIComponent(storyId)}`
          : `${BASE_URL}/voice/access`;
        const request = await apiFetch(url, {
          method: "GET",
        });
        const response: QueryResponse<VoiceAccess> = await request.json();
        if (!response.success) throw new Error(response.message);
        return response;
      } catch (err) {
        // For guests, return default access if API fails
        if (isGuest) {
          return {
            success: true,
            data: {
              isPremium: false,
              unlimited: false,
              defaultVoice: "NIMBUS",
              maxVoices: 1,
              lockedVoiceId: "NIMBUS",
              elevenLabsTrialStoryId: null,
              usedVoicesForStory: [],
              maxVoicesPerStory: 1,
            },
          };
        }
        throw new Error(getErrorMessage(err));
      }
    },
    staleTime: 30_000,
    select: (res) => res.data,
  });
};

export type { VoiceAccess };
export default useGetVoiceAccess;
