// hooks/tanstack/mutations/useRecommendStory.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";

export type RecommendPayload = {
  storyId: string;
  kidId: string;
};

export type RecommendResponse = {
  success: boolean;
  message?: string;
  data?: any; // type this if you know the API response shape
};

const recommendStory = async ({ storyId, kidId }: RecommendPayload) => {
  const url = `${BASE_URL}/stories`;
  const res = await apiFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      storyId,
      kidId,
      recommendBasedOnPreferences: true,
    }),
  });

  const json: RecommendResponse = await res.json().catch(() => {
    throw new Error("Invalid response from server");
  });

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to recommend story");
  }

  return json;
};

export default function useRecommendStory() {
  const queryClient = useQueryClient();

  return useMutation<RecommendResponse, Error, RecommendPayload>(
    recommendStory,
    {
      onSuccess: () => {
        // Invalidate story queries so UI updates
        queryClient.invalidateQueries({ queryKey: ["stories"] });
      },
    }
  );
}
