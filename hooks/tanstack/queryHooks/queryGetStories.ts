import { queryOptions } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { PaginatedData, QueryResponse, Story } from "../../../types";

type GetStoriesParam = {
  category?: string;
  minAge?: string;
  maxAge?: string;
  page?: number;
  limit?: number;
  isSeasonal?: boolean;
  isMostLiked?: boolean;
};

const queryGetStories = (params: GetStoriesParam) =>
  queryOptions({
    queryKey: ["stories", { ...params }],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.category) searchParams.set("category", params.category);
      if (params.minAge) searchParams.set("minAge", params.minAge);
      if (params.maxAge) searchParams.set("maxAge", params.maxAge);
      if (params.page) searchParams.set("page", String(params.page));
      if (params.limit) {
        searchParams.set("limit", String(params.limit));
      }
      if (params.isSeasonal !== undefined)
        searchParams.set("isSeasonal", String(params.isSeasonal));
      if (params.isMostLiked !== undefined)
        searchParams.set("isMostLiked", String(params.isMostLiked));

      const url = `${BASE_URL}/stories?${searchParams.toString()}`;
      const request = await apiFetch(url, {
        method: "GET",
      });
      const response: QueryResponse<PaginatedData<Story[]>> =
        await request.json();
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    select: (res) => res.data,
    gcTime: 1000 * 60 * 60 * 10,
  });

export type { GetStoriesParam };
export default queryGetStories;
