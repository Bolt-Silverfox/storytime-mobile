import { useInfiniteQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL, QUERY_KEYS } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";
import {
  CursorPaginatedData,
  LibraryFilterType,
  LibraryStory,
  QueryResponse,
} from "../../../types";

const FILTER_PATH: Record<LibraryFilterType, string> = {
  completed: "completed",
  ongoing: "continue-reading",
};

const DEFAULT_LIMIT = 20;

const useGetLibraryStories = (type: LibraryFilterType) => {
  const { user } = useAuth();

  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_LIBRARY_STORIES, type, user?.id],
    queryFn: ({ pageParam }) => getLibraryStories(type, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.nextCursor
        : undefined,
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60,
    maxPages: 10,
  });
};

export default useGetLibraryStories;

const getLibraryStories = async (
  type: LibraryFilterType,
  cursor: string | undefined,
): Promise<CursorPaginatedData<LibraryStory>> => {
  const searchParams = new URLSearchParams();
  searchParams.set("limit", String(DEFAULT_LIMIT));
  if (cursor) searchParams.set("cursor", cursor);

  const url = `${BASE_URL}/stories/user/library/${FILTER_PATH[type]}?${searchParams.toString()}`;
  const request = await apiFetch(url, { method: "GET" });
  const response: QueryResponse<CursorPaginatedData<LibraryStory>> =
    await request.json();
  if (!response.success) throw new Error(response.message);
  return response.data;
};
