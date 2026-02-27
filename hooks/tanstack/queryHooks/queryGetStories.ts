import { queryOptions } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import {
  AgeGroupType,
  PaginatedData,
  QueryResponse,
  Story,
} from "../../../types";

type GetStoriesParam = {
  category?: string;
  ageGroup?: AgeGroupType;
  page?: number;
  limit?: number;
  isSeasonal?: boolean;
  isMostLiked?: boolean;
  topPicksFromUs?: boolean;
};

const queryGetStories = (params: GetStoriesParam) =>
  queryOptions({
    queryKey: ["stories", { ...params }],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.category) searchParams.set("category", params.category);
      if (params.ageGroup && params.ageGroup !== "All") {
        const [minAge, maxAge] = params.ageGroup.split("-");
        searchParams.set("minAge", minAge);
        searchParams.set("maxAge", maxAge);
      }
      if (params.page) searchParams.set("page", String(params.page));
      if (params.isSeasonal !== undefined)
        searchParams.set("isSeasonal", String(params.isSeasonal));
      if (params.isMostLiked !== undefined)
        searchParams.set("isMostLiked", String(params.isMostLiked));
      if (params.topPicksFromUs !== undefined)
        searchParams.set(
          "topPicksFromUs",
          `"${String(params.topPicksFromUs)}"`
        );
      if (params.limit) {
        searchParams.set("limit", String(params.limit));
      } else {
        searchParams.set("limit", String(10));
      }

      const url = `${BASE_URL}/stories?${searchParams.toString()}`;
      const request = await apiFetch(url, {
        method: "GET",
      });
      const response: QueryResponse<PaginatedData<Story[]>> =
        await request.json();
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    staleTime: 1000 * 60 * 1,
    refetchOnWindowFocus: true,
    select: (res) => res.data,
    gcTime: 1000 * 60 * 60,
  });

export type { GetStoriesParam };
export default queryGetStories;
