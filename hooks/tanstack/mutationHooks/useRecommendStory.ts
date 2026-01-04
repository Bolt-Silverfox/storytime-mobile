import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";

const useRecommendStory = () => {
  return useMutation({
    mutationFn: async (data: {
      kidId: string;
      storyId: string;
      message: string;
    }) => {
      try {
        const request = await apiFetch(`${BASE_URL}/stories/recommend`, {
          method: "POST",
          body: JSON.stringify(data),
        });
        const response: QueryResponse = await request.json();
        if (!response.success) throw new Error(response.message);
        console.log("recommend story mutation response", response);
        return response;
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
    onSuccess: () => {
      Alert.alert("Story recommended successfully!");
    },
    onError: (err) => {
      console.error("Error recommending story", err);
      Alert.alert(err.message);
    },
  });
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
