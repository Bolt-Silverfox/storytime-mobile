import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse } from "../../../types";

type StoryRequest = {
  statusCode: number;
  success: boolean;
  data: Story[];
  message: string;
};

type Story = {
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
  recommended: false;
  aiGenerated: false;
  difficultyLevel: number;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
  images: string[];
  categories: string[];
  questions: {
    id: string;
    storyId: string;
    question: string;
    options: string[];
    correctOption: number;
  };
};

const useGetStoriesByCategory = (category: string) => {
  return useSuspenseQuery({
    queryKey: ["getStories", category],
    queryFn: async () => {
      const url = `${BASE_URL}/stories?category=${category}`;
      console.log("Story Category", category);

      const request = await apiFetch(url, {
        method: "GET",
      });
      const response: StoryRequest = await request.json();
      if (!response.success) {
        throw new Error(response.message ?? "Unexpected error,try again later");
      }
      return response;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    select: (res) => res.data,
  });
};

export type { Story, StoryRequest };

export default useGetStoriesByCategory;