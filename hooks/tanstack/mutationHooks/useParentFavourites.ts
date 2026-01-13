import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { FavouriteStory, QueryResponse, Story } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";
import useGetUserProfile from "../queryHooks/useGetUserProfile";

const useAddToFavourites = ({
  storyId,
  onSuccess,
}: {
  storyId: string;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  const { data } = useGetUserProfile();

  return useMutation({
    mutationFn: async () => await addToFavourites(storyId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["parentsFavourites", data?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["recommendedStoriesForParents", data?.id],
      });
      onSuccess?.();
    },
    onError: (err) => {
      throw new Error(err.message);
    },
  });
};

const useDeleteFromFavourites = ({
  storyId,
  onSuccess,
}: {
  storyId: string;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  const { data } = useGetUserProfile();
  return useMutation({
    mutationFn: async () => await deleteFromFavourites(storyId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["parentsFavourites", data?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["recommendedStoriesForParents", data?.id],
      });
      onSuccess?.();
    },
    onError: (err) => {
      throw new Error(err.message);
    },
  });
};

// pass the revalidate function directly in the onsuccess method, to revalidate whatever stories the favourite was toggled from.
// above won't work cos some stories may appear on different endpoints, only way is to revalidate all stories endpoints.
// might not need to revalidate anything, cos all storyitems are just checking if their id's exist on the favourite stories endponit, only need to revalidate favourite stories.

const useToggleFavourites = ({
  story,
  onSuccess,
}: {
  story: FavouriteStory;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  const { data } = useGetUserProfile();

  const favouritesQueryData: QueryResponse<FavouriteStory[]> | undefined =
    queryClient.getQueryData(["parentsFavourites", data?.id]);
  const cachedData = favouritesQueryData?.data ?? [];

  const isLiked = cachedData.some(
    (stories) => stories.storyId === story.storyId
  );
  return useMutation({
    mutationFn: async () => {
      // await new Promise<void>((resolve) =>
      //   setTimeout(() => {
      //     resolve();
      //   }, 3000)
      // );
      if (isLiked) {
        return await deleteFromFavourites(story.storyId);
      }

      return await addToFavourites(story.storyId);
    },
    onMutate: () => {
      queryClient.setQueryData(
        ["parentsFavourites", data?.id],
        (old: QueryResponse<FavouriteStory[]>) => {
          if (!old.data) return;
          if (isLiked) {
            const newFavourites = old.data.filter(
              (item) => item.storyId !== story.storyId
            );
            return { ...old, data: newFavourites };
          } else {
            return { ...old, data: [...old.data, story] };
          }
        }
      );
    },
    onSuccess: () => {
      // i don't need to invalidate cos it's the same data coming from the backend and i already added it on the onmutate method.
      // queryClient.invalidateQueries({
      //   queryKey: ["parentsFavourites", data?.id],
      // });
      onSuccess?.();
    },
    onError: (err) => {
      queryClient.setQueryData(
        ["parentsFavourites", data?.id],
        favouritesQueryData
      );
      throw new Error(getErrorMessage(err));
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
        }
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

export { useAddToFavourites, useDeleteFromFavourites, useToggleFavourites };
