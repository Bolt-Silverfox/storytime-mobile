import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";

const useGetKidById = (id: string) => {
  return useQuery({
    queryKey: ["kidById", id],
    queryFn: async () => {
      const url = `${BASE_URL}/user/kids/${id}`;
      const request = await apiFetch(url, {
        method: "GET",
      });
      const response = await request.json();
      if (!response.success) {
        throw new Error(response.message ?? "Unexpected error, try again");
      }
      return response;
    },
    retryOnMount: false,
    refetchOnWindowFocus: false,
    select: (res) => res.data,
  });
};

export default useGetKidById;
