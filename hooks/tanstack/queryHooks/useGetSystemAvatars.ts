import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../../constants";
import apiFetch from "../../../apiFetch";
import { QueryResponse, SystemAvatar } from "../../../types";

const useGetSystemAvatars = () => {
  return useQuery({
    queryKey: ["systemAvatars"],
    queryFn: async () => {
      const url = `${BASE_URL}/avatars/system`;
      const request = await apiFetch(url, {
        method: "GET",
      });
      const response: QueryResponse<SystemAvatar[]> = await request.json();
      if (!response.success) {
        throw new Error(response.mesage);
      }
      return response;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    select: (res) => res.data,
  });
};

export default useGetSystemAvatars;
