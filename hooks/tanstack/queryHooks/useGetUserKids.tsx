import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../contexts/AuthContext";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { KidType } from "../../../types";

const useGetUserKids = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["userKids"],
    queryFn: async () => {
      const response = await apiFetch(`${BASE_URL}/auth/kids`, {
        method: "GET",
      });
      const result: KidType = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    staleTime: Infinity,
    enabled: !!user,
    select: (res) => res.data,
  });
};

export default useGetUserKids;
