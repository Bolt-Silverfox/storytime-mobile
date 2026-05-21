import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { DEFAULT_GUEST_VOICE_ID } from "../../../constants/constants";
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
  const { isGuest, user } = useAuth();
  const isGuestReader = isGuest || !user;
  const guestVoiceAccess: QueryResponse<VoiceAccess> = {
    success: true,
    statusCode: 200,
    message: "Guest default voice access",
    data: {
      isPremium: false,
      unlimited: false,
      defaultVoice: DEFAULT_GUEST_VOICE_ID,
      maxVoices: 1,
      lockedVoiceId: DEFAULT_GUEST_VOICE_ID,
      elevenLabsTrialStoryId: null,
      usedVoicesForStory: [],
      maxVoicesPerStory: 1,
    },
  };

  return useQuery({
    queryKey: [
      "voiceAccess",
      isGuestReader ? "guest" : "user",
      storyId ?? null,
    ],
    initialData: isGuestReader ? guestVoiceAccess : undefined,
    queryFn: async () => {
      if (isGuestReader) {
        return guestVoiceAccess;
      }

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
        throw new Error(getErrorMessage(err));
      }
    },
    staleTime: isGuestReader ? Infinity : 30_000,
    select: (res) => res.data,
  });
};

export type { VoiceAccess };
export default useGetVoiceAccess;
