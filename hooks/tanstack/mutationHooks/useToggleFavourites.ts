import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { FavouriteStory, QueryResponse } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";
import useGetUserProfile from "../queryHooks/useGetUserProfile";
import { Alert } from "react-native";

const useToggleFavourites = ({
  story,
  onSuccess,
}: {
  story: FavouriteStory;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  const { data } = useGetUserProfile();
  const queryKey = ["parentsFavourites", data?.id] as const;
  const previousData: QueryResponse<FavouriteStory[]> | undefined =
    queryClient.getQueryData(queryKey);

  return useMutation({
    mutationFn: async () => {
      await queryClient.cancelQueries({ queryKey });

      const cachedData = previousData?.data ?? [];
      const isLiked = cachedData.some(
        (stories) => stories.storyId === story.storyId,
      );

      if (isLiked) {
        return await deleteFromFavourites(story.storyId);
      }

      return await addToFavourites(story.storyId);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      if (!previousData?.data) return { previousData };

      const cachedData: FavouriteStory[] = previousData.data;
      const isLiked = cachedData.some(
        (stories) => stories.storyId === story.storyId,
      );

      const newFavourites = isLiked
        ? cachedData.filter((item) => item.storyId !== story.storyId)
        : [...cachedData, story];

      queryClient.setQueryData<QueryResponse<FavouriteStory[]>>(queryKey, {
        ...previousData,
        data: newFavourites,
      });

      return { previousData };
    },
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (err, _, mutationResult) => {
      if (mutationResult?.previousData) {
        queryClient.setQueryData(queryKey, mutationResult.previousData);
      }
      Alert.alert(
        getErrorMessage(err),
        "Failed to add/remove story from favourites",
      );
    },
  });
};

const deleteFromFavourites = async (storyId: string) => {
  {
    try {
      const request = await apiFetch(
        `${BASE_URL}/parent-favorites/${storyId}`,
        {
          method: "DELETE",
        },
      );
      const response: QueryResponse = await request.json();
      if (!response.success) throw new Error(response.message);
      return response;
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  }
};

const addToFavourites = async (storyId: string) => {
  try {
    const request = await apiFetch(`${BASE_URL}/parent-favorites`, {
      method: "POST",
      body: JSON.stringify({ storyId }),
    });
    const response: QueryResponse = await request.json();
    if (!response.success) throw new Error(response.message);
    return response;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
};

export { useToggleFavourites };
