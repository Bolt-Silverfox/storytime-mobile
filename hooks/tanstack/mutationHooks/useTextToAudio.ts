import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import { getErrorMessage } from "../../../utils/utils";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse } from "../../../types";
import { Dispatch, SetStateAction } from "react";

const useTextToAudio = ({
  setGeneratedAudio,
}: {
  setGeneratedAudio: Dispatch<SetStateAction<string | undefined>>;
}) => {
  return useMutation({
    mutationFn: async (params: { content: string; voiceType: string }) => {
      try {
        const request = await apiFetch(`${BASE_URL}/voice/story/audio`, {
          method: "POST",
          body: JSON.stringify(params),
        });
        const response: QueryResponse<{ audioUrl: string; voiceType: string }> =
          await request.json();
        if (!response.success) throw new Error(response.message);
        return response;
      } catch (err) {
        throw new Error(getErrorMessage(err));
      }
    },
    onSuccess: (data) => {
      setGeneratedAudio(data.data.audioUrl);
    },
    onError: (err) => {
      Alert.alert("Failed to generate audio", getErrorMessage(err));
    },
  });
};

export default useTextToAudio;
