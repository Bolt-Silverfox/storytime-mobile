import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse } from "../../../types";
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

  const favouritesData = queryClient.getQueryData([
    "parentsFavourites",
    data?.id,
  ]);

  console.log("parents favourites data", favouritesData);
  return useMutation({
    mutationFn: async () => await addToFavourites(storyId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["parentsFavourites", data?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["recommendedStoriesForParents", data?.id],
      });
      Alert.alert("Added to favourites successfully");
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
      Alert.alert("Added to favourites successfully");
      onSuccess?.();
    },
    onError: (err) => {
      throw new Error(err.message);
    },
  });
};

const useToggleFavourites = ({
  storyId,
  onSuccess,
}: {
  storyId: string;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  const { data } = useGetUserProfile();
  const favouritesData = queryClient.getQueryData([
    "parentsFavourites",
    data?.id,
  ]);

  console.log("parents favourites data", favouritesData);
  const isLiked = true;
  return useMutation({
    mutationFn: async () => {
      if (isLiked) {
        return await deleteFromFavourites(storyId);
      }
      return await addToFavourites(storyId);
    },
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
