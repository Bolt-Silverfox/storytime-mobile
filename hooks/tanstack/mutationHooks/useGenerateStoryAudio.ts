import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { BASE_URL } from "../../../constants";
import apiFetch from "../../../apiFetch";

type GenerateAudioVars = {
  content: string;
  voiceType: string;
};

type AudioResponse = {
  id: string;
  path: string;
  startedAt: string;
  completedAt: string;
};

const useGenerateStoryAudio = ({
  onSuccess,
}: {
  onSuccess?: (data: AudioResponse) => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation<AudioResponse, Error, GenerateAudioVars>({
    mutationFn: async (vars: GenerateAudioVars) => {
      const url = `${BASE_URL}/stories/story/audio`;

      const request = await apiFetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: vars.content,
          voiceType: vars.voiceType,
        }),
      });

      if (!request.ok) {
        let errMsg = "Unexpected error generating audio";
        try {
          const err = await request.json();
          errMsg = err.message ?? errMsg;
        } catch {}
        throw new Error(errMsg);
      }

      const res = await request.json();
      const audio: AudioResponse = res.data ?? res;

      return audio;
    },

    onError: (err: any) => {
      Alert.alert(err?.message ?? "Failed to generate audio");
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["storyAudio"] });
      onSuccess?.(data);
    },
  });
};

export default useGenerateStoryAudio;
