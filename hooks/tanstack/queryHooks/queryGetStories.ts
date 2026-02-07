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
    select: (res) => res.data,
    gcTime: 60 * 60 * 10,
  });

export default queryGetStories;
