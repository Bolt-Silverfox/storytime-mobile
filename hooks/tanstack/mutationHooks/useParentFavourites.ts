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
  return useMutation({
    mutationFn: async () => {
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["parentsFavourites", data?.id],
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
    mutationFn: async () => {
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["parentsFavourites", data?.id],
      });
      Alert.alert("Added to favourites successfully");
      onSuccess?.();
    },
    onError: (err) => {
      throw new Error(err.message);
    },
  });
};

export { useAddToFavourites, useDeleteFromFavourites };
