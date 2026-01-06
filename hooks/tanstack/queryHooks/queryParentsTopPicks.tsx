import { queryOptions } from "@tanstack/react-query";
import { getErrorMessage } from "../../../utils/utils";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse, Story } from "../../../types";

const queryParentsTopPicks = ({ limit = 10 }: { limit?: number }) => {
  return queryOptions({
    queryKey: ["parentsTopPicks"],
    queryFn: async () => {
      try {
        const request = await apiFetch(
          `${BASE_URL}/stories/recommendations/top-picks?limit=${limit}`,
          { method: "GET" }
        );
        const response: QueryResponse<Story[]> = await request.json();
        if (!response.success) throw new Error(response.message);
        console.log("recommended stories data", response);
        return response;
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
    staleTime: Infinity,
    select: (res) => res.data,
  });
};

export default queryParentsTopPicks;
