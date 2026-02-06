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
      const url = `${BASE_URL}/stories?category=${params.category ?? ""}&minAge=${params.minAge}&maxAge=${params.maxAge}&page=${params.page ?? 1}&limit=${params.limit ?? 10}`;
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
  });

export default queryGetStories;
