import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";

const useRecommendStory = ({ onSuccess }: { onSuccess: () => void }) => {
  return useMutation({
    mutationFn: async (data: {
      kidsIds: string[];
      storyId: string;
      message: string;
    }) => {
      await Promise.all(
        data.kidsIds.map((kid) =>
          recommendStory(kid, data.storyId, data.message)
        )
      );
    },
    onSuccess: () => {
      onSuccess();
      Alert.alert("Story recommended successfully!");
    },
    onError: (err) => {
      Alert.alert(err.message);
    },
  });
};

const recommendStory = async (
  kidId: string,
  storyId: string,
  message: string
) => {
  try {
    const request = await apiFetch(`${BASE_URL}/stories/recommend`, {
      method: "POST",
      body: JSON.stringify({
        kidId,
        storyId,
        message,
      }),
    });
    const response: QueryResponse = await request.json();
    if (!response.success) throw new Error(response.message);
    return response;
  } catch (err: unknown) {
    throw new Error(getErrorMessage(err));
  }
};

const useDeleteRecommendation = () => {
  return useMutation({
    mutationFn: async (recommendationId: string) => {
      try {
        const request = await apiFetch(
          `${BASE_URL}/stories/recommendations/${recommendationId}`,
          { method: "DELETE" }
        );
        const response: QueryResponse = await request.json();
        if (!response.success) throw new Error(response.message);
        return response;
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
  });
};

export { useDeleteRecommendation, useRecommendStory };
