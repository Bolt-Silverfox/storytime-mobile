import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../../constants";
import apiFetch from "../../../apiFetch";
import { QueryResponse } from "../../../types";

type GeneratedStory = {
  id: string;
  title: string;
  description: string;
  language: string;
  coverImageUrl: string;
  audioUrl: string;
  textContent: string;
  isInteractive: boolean;
  ageMin: number;
  ageMax: number;
  recommended: boolean;
  aiGenerated: boolean;
  difficultyLevel: number;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: null | string;
  creatorKidId: string;
};

const useGetGeneratedStories = (kidId: string) => {
  return useQuery({
    queryFn: async () => {
      const url = `${BASE_URL}/stories/library/${kidId}/created`;
      const request = await apiFetch(url, {
        method: "GET",
      });
      const response: QueryResponse<GeneratedStory[]> = await request.json();
      if (!response.success) throw new Error(response.message);
      return response;
    },
    queryKey: ["generatedStories"],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    select: (res) => res.data,
  });
};

export default useGetGeneratedStories;
