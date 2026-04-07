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
      const response: QueryResponse<string> = await request.json();
      if (!response.success)
        throw new Error(response.message ?? "Unexpected error, try again.");
      const parsedData: { value: Categories[] } = JSON.parse(response.data);
      console.log("parsed Data", parsedData);
      console.log("parsed value data", parsedData.value);
      return parsedData.value;
      // return response.data;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
};

export type { Categories };
export default queryStoryCategories;
