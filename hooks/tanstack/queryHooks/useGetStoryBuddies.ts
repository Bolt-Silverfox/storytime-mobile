import { useSuspenseQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse } from "../../../types";

type StoryBuddy = {
  data: {
    id: string;
    name: string;
    description: string;
    type: string;
    imageUrl: string;
    profileAvatarUrl: string;
    isActive: string;
    themeColor: string;
    ageGroupMin: number;
    ageGroupMax: number;
    createdAt: string;
    updatedAt: string;
  }[];
  success: boolean;
  statusCode: number;
};

const useGetStoryBuddies = () => {
  return useSuspenseQuery({
    queryFn: async () => {
      const url = `${BASE_URL}/story-buddies/active`;
      const request = await apiFetch(url, {
        method: "GET",
      });
      const response: QueryResponse<StoryBuddy> = await request.json();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response;
    },
    queryKey: ["storyBuddies"],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    select: (res) => res.data.data,
  });
};

export default useGetStoryBuddies;
