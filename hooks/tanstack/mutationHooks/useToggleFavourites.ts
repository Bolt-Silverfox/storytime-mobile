import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { ERROR_MESSAGES, QUERY_KEYS } from "../../../constants/ui";
import { FavouriteStory, QueryResponse } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";
import useGetUserProfile from "../queryHooks/useGetUserProfile";

const useToggleFavourites = ({
  story,
  onSuccess,
}: {
  story: FavouriteStory;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  const { data } = useGetUserProfile();
  const queryKey = [QUERY_KEYS.parentsFavourites, data?.id] as const;

  return useMutation({
    mutationFn: async () => {
      await queryClient.cancelQueries({ queryKey });

      const currentData =
        queryClient.getQueryData<QueryResponse<FavouriteStory[]>>(queryKey);
      const cachedData = currentData?.data ?? [];
      const isLiked = cachedData.some(
        (stories) => stories.storyId === story.storyId
      );

      if (isLiked) {
        return await deleteFromFavourites(story.storyId);
      }

      return await addToFavourites(story.storyId);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousData =
        queryClient.getQueryData<QueryResponse<FavouriteStory[]>>(queryKey);

      if (!previousData?.data) return { previousData };

      const cachedData: FavouriteStory[] = previousData.data;
      const isLiked = cachedData.some(
        (stories) => stories.storyId === story.storyId
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
    onError: (err, _, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      Alert.alert(getErrorMessage(err), ERROR_MESSAGES.favourites.toggleFailed);
    },
  });
};

const deleteFromFavourites = async (storyId: string) => {
  try {
    const request = await apiFetch(`${BASE_URL}/parent-favorites/${storyId}`, {
      method: "DELETE",
    });
    const response: QueryResponse = await request.json();
    if (!response.success) throw new Error(response.message);
    return response;
  } catch (err) {
    throw new Error(getErrorMessage(err));
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
