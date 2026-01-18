import { queryOptions } from "@tanstack/react-query";
import { getErrorMessage } from "../../../utils/utils";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { AvailableVoices, QueryResponse } from "../../../types";

const queryAvailableVoices = queryOptions({
  queryKey: ["availableVoices"],
  queryFn: async () => {
    try {
      const request = await apiFetch(`${BASE_URL}/voice/available`, {
        method: "GET",
      });
      const response: QueryResponse<AvailableVoices[]> = await request.json();
      if (!response.success) throw new Error(response.message);
      return response;
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  },
  staleTime: Infinity,
  select: (res) => res.data,
});

export default queryAvailableVoices;
