import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL, QUERY_KEYS } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";
import { LibraryFilterType, LibraryStory, QueryResponse } from "../../../types";

const FILTER_PATH: Record<LibraryFilterType, string> = {
  completed: "completed",
  ongoing: "continue-reading",
};

const useGetLibraryStories = (type: LibraryFilterType) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: [QUERY_KEYS.GET_LIBRARY_STORIES, type, user?.id],
    queryFn: () => getLibraryStories(type),
    select: (res) => res.data,
    enabled: !!user,
    staleTime: Infinity,
  });
};

export default useGetLibraryStories;
export { getLibraryStories };

const getLibraryStories = async (type: LibraryFilterType) => {
  const url = `${BASE_URL}/stories/user/library/${FILTER_PATH[type]}`;
  const request = await apiFetch(url, {
    method: "GET",
  });
  const response: QueryResponse<LibraryStory[]> = await request.json();
  if (!response.success) throw new Error(response.message);
  return response;
};
