import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse, Story } from "../../../types";

const useGetStories = (kidId: string) => {
  return useQuery({
    queryKey: ["stories", kidId],
    queryFn: async () => {
      const request = await apiFetch(`${BASE_URL}/stories?kidId=${kidId}`, {
        method: "GET",
      });
      const response: QueryResponse<Story[]> = await request.json();
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    staleTime: Infinity,
  });
};

export default useGetStories;
