import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../../../constants";
import apiFetch from "../../../apiFetch";

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
