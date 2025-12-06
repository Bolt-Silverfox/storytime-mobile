// hooks/tanstack/queryHooks/useGetRecommendedStory.ts
import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";

// Define and export the Story type
export interface Story {
  id: string;
  title: string;
  coverImageUrl: string;
  [key: string]: any; // Optional: any other fields your backend may return
}

// Function to fetch recommended stories for a kid
const fetchRecommendedStory = async (kidId: string): Promise<Story[]> => {
  const url = `${BASE_URL}/stories/recommendations/kid/${kidId}`;
  const res = await apiFetch(url);

  if (!res.ok) throw new Error("Failed to load recommended stories");

  const json = await res.json();

  console.log("🔥 Recommended stories response:", JSON.stringify(json, null, 2));

  // Normalize: return an array of Story objects
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json?.data?.data)) return json.data.data;

  return [];
};

// Hook to be used in components
export default function useGetRecommendedStory(kidId: string) {
  return useQuery<Story[]>({
    queryKey: ["recommendedStory", kidId],
    queryFn: () => fetchRecommendedStory(kidId),
  });
}
