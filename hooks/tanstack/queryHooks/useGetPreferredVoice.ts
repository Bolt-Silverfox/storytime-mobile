import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";
import { AvailableVoices, QueryResponse } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";

const useGetPreferredVoice = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["preferredVoice", user?.id],
    queryFn: async () => {
      try {
        const request = await apiFetch(`${BASE_URL}/voice/preferred`, {
          method: "GET",
        });
        const response: QueryResponse<AvailableVoices> = await request.json();
        if (!response.success) throw new Error(response.message);
        return response;
      } catch (err) {
        throw new Error(getErrorMessage(err));
      }
    },
    enabled: !!user,
    staleTime: Infinity,
    select: (res) => res.data,
  });
};

export default useGetPreferredVoice;
