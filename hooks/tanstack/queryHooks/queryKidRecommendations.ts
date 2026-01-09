import { queryOptions } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse, Story } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";

const queryKidRecommendations = (kidId: string) => {
  return queryOptions({
    queryKey: ["recommendStory", kidId],
    queryFn: async () => {
      try {
        const request = await apiFetch(
          `${BASE_URL}/stories/recommendations/kid/${kidId}`,
          {
            method: "GET",
          }
        );
        const response: QueryResponse<Story[]> = await request.json();
        if (!response.success) throw new Error(response.message);
        return response;
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
    staleTime: Infinity,
    select: (res) => res.data,
    gcTime: 60 * 60 * 10,
  });
};

const queryKidReommendationsStatistics = (kidId: string) => {
  return queryOptions({
    queryKey: ["recommendationStatistics", kidId],
    queryFn: async () => {
      try {
        const request = await apiFetch(
          `${BASE_URL}/stories/recommendations/kid/${kidId}/stats`,
          { method: "GET" }
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

export { queryKidRecommendations, queryKidReommendationsStatistics };
