import { useInfiniteQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import {
  BASE_URL,
  DEFAULT_CURSOR_PAGE_SIZE,
} from "../../../constants";
import useAuth from "../../../contexts/AuthContext";
import {
  CursorPaginatedData,
  FavouriteStory,
  QueryResponse,
} from "../../../types";
import { getErrorMessage } from "../../../utils/utils";

const useQueryParentsFavourites = () => {
  const { user } = useAuth();

  return useInfiniteQuery({
    queryKey: ["parentsFavourites", user?.id],
    queryFn: ({ pageParam }) => fetchFavourites(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage?.pagination?.hasNextPage && lastPage.pagination.nextCursor
        ? lastPage.pagination.nextCursor
        : undefined,
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60,
    maxPages: 10,
  });
};

export default useQueryParentsFavourites;

const fetchFavourites = async (
  cursor: string | undefined
): Promise<CursorPaginatedData<FavouriteStory>> => {
  const searchParams = new URLSearchParams();
  searchParams.set("limit", String(DEFAULT_CURSOR_PAGE_SIZE));
  if (cursor) searchParams.set("cursor", cursor);

  const url = `${BASE_URL}/parent-favorites?${searchParams.toString()}`;
  try {
    const request = await apiFetch(url, { method: "GET" });
    const response: QueryResponse<CursorPaginatedData<FavouriteStory>> =
      await request.json();
    if (!response.success) throw new Error(response.message);
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
};
