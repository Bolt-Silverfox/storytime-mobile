import { queryOptions } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { FavouriteStory, QueryResponse, Story } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";
import useGetUserProfile from "./useGetUserProfile";

const queryParentsFavourites = () => {
  const { data } = useGetUserProfile();
  return queryOptions({
    queryKey: ["parentsFavourites", data?.id],
    queryFn: async () => {
      try {
        const request = await apiFetch(`${BASE_URL}/parent-favorites`, {
          method: "GET",
        });
        const response: QueryResponse<FavouriteStory[]> = await request.json();
        if (!response.success) throw new Error(response.message);
        return response;
      } catch (err) {
        throw new Error(getErrorMessage(err));
      }
    },
    staleTime: Infinity,
    select: (res) => res.data,
    gcTime: 60 * 60 * 20,
  });
};

export default queryParentsFavourites;
