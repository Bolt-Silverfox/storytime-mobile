import { queryOptions } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse, Story } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";

const queryKidsStories = (kidId: string) => {
  return queryOptions({
    queryKey: ["getStories", kidId],
    queryFn: async () => {
      const [storiesByKidId, recommendedKidStories] = await Promise.all([
        getStoriesByKidId(kidId),
        getKidsRecommendedStories(kidId),
      ]);
      const kidStories = [...storiesByKidId, ...recommendedKidStories];
      return kidStories;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
};

export default queryKidsStories;

const getStoriesByKidId = async (kidId: string) => {
  try {
    const request = await apiFetch(`${BASE_URL}/stories?kidId=${kidId}`);
    const response: QueryResponse<{ data: Story[] }> = await request.json();
    if (!response.success) throw new Error(response.message);
    return response.data.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
};

const getKidsRecommendedStories = async (kidId: string) => {
  try {
    const request = await apiFetch(
      `${BASE_URL}/stories/recommendations/kid/${kidId}`,
      {
        method: "GET",
      }
    );
    const response: QueryResponse<Story[]> = await request.json();
    if (!response.success) {
      throw new Error(response.message ?? "Unexpected error,try again later");
    }
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
};
