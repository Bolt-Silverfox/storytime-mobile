import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";

type AddFavBody = {
  kidId: string;
  storyId: string;
};

const useAddFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: AddFavBody) => {
      if (!body || !body.kidId?.trim() || !body.storyId?.trim()) {
        throw new Error("kidId and storyId are required to add a favorite.");
      }

      const response = await apiFetch(`${BASE_URL}/stories/favorites`, {
        method: "POST",
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (!result || result.success === false) {
        throw new Error(result?.message ?? "Failed to add favorite.");
      }

      return result;
    },

    // onMutate should return context for rollback (optional)
    onMutate: async (body: AddFavBody) => {
      // cancel queries using filter object form
      await queryClient.cancelQueries({ queryKey: ["stories", body.storyId] });
      await queryClient.cancelQueries({
        queryKey: ["userFavorites", body.kidId],
      });

      const prevStory = queryClient.getQueryData(["stories", body.storyId]);
      const prevFavs = queryClient.getQueryData(["userFavorites", body.kidId]);

      return { prevStory, prevFavs };
    },

    onError: (err: unknown, _vars, context: any) => {
      if (context?.prevStory) {
        queryClient.setQueryData(
          ["stories", (_vars as AddFavBody).storyId],
          context.prevStory
        );
      }
      if (context?.prevFavs) {
        queryClient.setQueryData(
          ["userFavorites", (_vars as AddFavBody).kidId],
          context.prevFavs
        );
      }

      const message = err instanceof Error ? err.message : String(err);
      Alert.alert(message);
    },

    onSuccess: (_data, vars) => {
      // invalidate using filter object form
      queryClient.invalidateQueries({ queryKey: ["stories", vars.storyId] });
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      queryClient.invalidateQueries({
        queryKey: ["userFavorites", vars.kidId],
      });
      queryClient.invalidateQueries({ queryKey: ["kidFavorite", vars.kidId] });

      Alert.alert("Added to Favorites");

    },
  });
};

export default useAddFavorites;
