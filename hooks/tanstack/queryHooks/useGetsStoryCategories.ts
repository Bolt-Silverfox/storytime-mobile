import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../../constants";
import apiFetch from "../../../apiFetch";

type Response = {
  statusCode: number;
  success: boolean;
  data: Categories[];
  message: string;
};

type Categories = {
  id: string;
  name: string;
  image: string;
  description: string;
};
const useGetStoryCategories = () => {
  return useQuery({
    queryKey: ["storyCategories"],
    queryFn: async () => {
      const url = `${BASE_URL}/stories/categories`;
      const request = await apiFetch(url, {
        method: "GET",
      });
      const response: Response = await request.json();
      if (!response.success) {
        throw new Error(response.message ?? "Unexpected error, try again");
      }
      console.log("story categories", response);
      return response;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    select: (res) => res.data,
  });
};

export default useGetStoryCategories;
