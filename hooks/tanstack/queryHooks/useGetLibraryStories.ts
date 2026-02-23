import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL, QUERY_KEYS } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";
import { LibraryFilterType, LibraryStory, QueryResponse } from "../../../types";

const useGetLibraryStories = (type: LibraryFilterType) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: [QUERY_KEYS.GET_LIBRARY_STORIES, type, user?.id],
    queryFn: async () => {
      const url = `${BASE_URL}/stories/user/library/${type === "completed" ? "completed" : "continue-reading"}`;
      const request = await apiFetch(url, {
        method: "GET",
      });
      const response: QueryResponse<LibraryStory[]> = await request.json();
      if (!response.success) throw new Error(response.message);
      return response;
    },
    select: (res) => res.data,
    enabled: !!user,
    staleTime: Infinity,
  });
};

export default useGetLibraryStories;
