import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";
import { QueryResponse, Story } from "../../../types";

const useGetRecommendStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      kidId,
      storyId,
      message,
    }: {
      kidId: string;
      storyId: string;
      message?: string;
    }) => {
      const url = `${BASE_URL}/stories/recommend`;

      const request = await apiFetch(url, {
        method: "POST",
        body: JSON.stringify({
          kidId,
          storyId,
          message,
        }),
      });

      const response = await request.json();

      // ❗ DO NOT ALERT HERE
      // ❗ RETURN raw response so UI can handle "already recommended"
      return response;
    },

    onSuccess: (res, variables) => {
      // Invalidate queries only when success = true
      if (res?.success) {
        queryClient.invalidateQueries({
          queryKey: ["kidById", variables.kidId],
        });

        queryClient.invalidateQueries({
          queryKey: ["storyById", variables.storyId],
        });

        queryClient.invalidateQueries({
          queryKey: ["stories"],
        });
      }
    },
  });
};

export default useGetRecommendStory;

const queryRecommendedStories = () => {
  const { user } = useAuth();
  return queryOptions({
    queryKey: ["recommendedStoriesForParents", user?.id],
    queryFn: async () => {
      try {
        const request = await apiFetch(`${BASE_URL}/stories?recommended=true`, {
          method: "GET",
        });
        const response: QueryResponse<{ data: Story[] }> = await request.json();
        if (!response.success) throw new Error(response.message);
        return response;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Unexpected error, try again";
        throw new Error(message);
      }
    },
    staleTime: Infinity,
    select: (res) => res.data.data,
  });
};

export { queryRecommendedStories };
