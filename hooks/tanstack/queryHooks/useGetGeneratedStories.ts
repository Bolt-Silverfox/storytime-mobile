import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../../constants";
import apiFetch from "../../../apiFetch";
import { QueryResponse } from "../../../types";

type GeneratedStory = {};

const useGetGeneratedStories = (kidId: string) => {
  return useQuery({
    queryFn: async () => {
      const url = `${BASE_URL}/stories/library/${kidId}`;
      const request = await apiFetch(url, {
        method: "GET",
      });
      const response: QueryResponse<GeneratedStory> = await request.json();
      console.log("get geenerted stories", response);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    queryKey: ["generatedStories"],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    select: (res) => res,
  });
};

export default useGetGeneratedStories;
