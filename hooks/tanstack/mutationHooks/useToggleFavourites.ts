import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Alert } from "react-native";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { ERROR_MESSAGES, QUERY_KEYS } from "../../../constants/ui";
import {
  CursorPaginatedData,
  FavouriteStory,
  QueryResponse,
} from "../../../types";
import { getErrorMessage } from "../../../utils/utils";
import useGetUserProfile from "../queryHooks/useGetUserProfile";

type FavouritesCache = InfiniteData<CursorPaginatedData<FavouriteStory>>;

const useToggleFavourites = ({
  story,
  isLiked,
  onSuccess,
}: {
  story: FavouriteStory;
  isLiked: boolean;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  const { data } = useGetUserProfile();
  const queryKey = [QUERY_KEYS.parentsFavourites, data?.id] as const;

  return useMutation({
    mutationFn: async () => {
      await queryClient.cancelQueries({ queryKey });

      if (isLiked) {
        return await deleteFromFavourites(story.storyId);
      }

      return await addToFavourites(story.storyId);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<FavouritesCache>(queryKey);
      if (!previousData?.pages?.length) return { previousData };

      // Optimistic update on the first page
      const updatedPages = previousData.pages.map((page, i) => {
        if (i !== 0) return page;
        const updatedData = isLiked
          ? page.data.filter((item) => item.storyId !== story.storyId)
          : [...page.data, story];
        return { ...page, data: updatedData };
      });

      queryClient.setQueryData<FavouritesCache>(queryKey, {
        ...previousData,
        pages: updatedPages,
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
