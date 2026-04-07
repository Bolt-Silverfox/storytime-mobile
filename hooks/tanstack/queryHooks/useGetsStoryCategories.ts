import { queryOptions } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse } from "../../../types";

type Categories = {
  id: string;
  name: string;
  image: string;
  description: string;
  storyCount: number;
};

const queryStoryCategories = () => {
  return queryOptions({
    queryKey: ["storyCategories"],
    queryFn: async () => {
      const url = `${BASE_URL}/stories/categories`;
      const request = await apiFetch(url, {
        method: "GET",
      });
      const response: QueryResponse<Categories[]> = await request.json();
      if (!response.success)
        throw new Error(response.message ?? "Unexpected error, try again.");

      return response.data;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
};

export default queryStoryCategories;
