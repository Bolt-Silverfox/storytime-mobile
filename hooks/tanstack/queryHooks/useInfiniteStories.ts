import { useInfiniteQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import {
  BASE_URL,
  DEFAULT_CURSOR_PAGE_SIZE,
  QUERY_KEYS,
} from "../../../constants";
import {
  AgeGroupType,
  CursorPaginatedData,
  QueryResponse,
  Story,
} from "../../../types";

type InfiniteStoriesParam = {
  category?: string;
  ageGroup?: AgeGroupType;
  limit?: number;
  isSeasonal?: boolean;
  isMostLiked?: boolean;
};

const useInfiniteStories = (params: InfiniteStoriesParam) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_STORIES, "infinite", params],
    queryFn: ({ pageParam }) => fetchStoriesCursor(params, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage?.pagination?.hasNextPage && lastPage.pagination.nextCursor
        ? lastPage.pagination.nextCursor
        : undefined,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60,
    maxPages: 10,
  });
};

export type { InfiniteStoriesParam };
export default useInfiniteStories;

const fetchStoriesCursor = async (
  params: InfiniteStoriesParam,
  cursor: string | undefined
): Promise<CursorPaginatedData<Story>> => {
  const searchParams = new URLSearchParams();

  searchParams.set("limit", String(params.limit ?? DEFAULT_CURSOR_PAGE_SIZE));
  // Always send cursor param to signal cursor pagination mode to the backend.
  // First page sends empty string; backend sanitizes to undefined for first-page fetch.
  searchParams.set("cursor", cursor ?? "");

  if (params.category) searchParams.set("category", params.category);
  if (params.ageGroup && params.ageGroup !== "All") {
    const [minAge, maxAge] = params.ageGroup.split("-");
    searchParams.set("minAge", minAge);
    searchParams.set("maxAge", maxAge);
  }
  if (params.isSeasonal !== undefined)
    searchParams.set("isSeasonal", String(params.isSeasonal));
  if (params.isMostLiked !== undefined)
    searchParams.set("isMostLiked", String(params.isMostLiked));

  const url = `${BASE_URL}/stories?${searchParams.toString()}`;
  const request = await apiFetch(url, { method: "GET" });
  const response: QueryResponse<CursorPaginatedData<Story>> =
    await request.json();
  if (!response.success) throw new Error(response.message);
  return response.data;
};
