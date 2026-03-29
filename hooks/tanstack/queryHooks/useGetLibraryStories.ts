import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import {
  BASE_URL,
  DEFAULT_CURSOR_PAGE_SIZE,
  QUERY_KEYS,
} from "../../../constants";
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

const useGetLibraryStories = (type: LibraryFilterType) => {
  const { user, isGuest } = useAuth();

  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_LIBRARY_STORIES, type, user?.id, isGuest],
    queryFn: ({ pageParam }) => getLibraryStories(type, pageParam, isGuest),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage?.pagination?.hasNextPage && lastPage.pagination.nextCursor
        ? lastPage.pagination.nextCursor
        : undefined,
    enabled: !!user || isGuest,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 60,
    maxPages: 10,
    placeholderData: keepPreviousData,
  });
};

export default useGetLibraryStories;

const getLibraryStories = async (
  type: LibraryFilterType,
  cursor: string | undefined,
  isGuest: boolean = false
): Promise<CursorPaginatedData<LibraryStory>> => {
  const searchParams = new URLSearchParams();
  searchParams.set("limit", String(DEFAULT_CURSOR_PAGE_SIZE));
  if (cursor) searchParams.set("cursor", cursor);

  // Use guest endpoint for guests, user endpoint for authenticated users
  const url = isGuest
    ? `${BASE_URL}/guest/history?${searchParams.toString()}`
    : `${BASE_URL}/stories/user/library/${FILTER_PATH[type]}?${searchParams.toString()}`;
  const request = await apiFetch(url, { method: "GET" });
  const response: QueryResponse<CursorPaginatedData<LibraryStory>> =
    await request.json();
  if (!response.success) throw new Error(response.message);

  // Guest endpoint returns all stories; filter client-side by completion status
  if (isGuest && response.data?.data) {
    const filtered = response.data.data.filter((story) =>
      type === "completed" ? story.progress >= 100 : story.progress < 100
    );
    return { ...response.data, data: filtered };
  }

  return response.data;
};
