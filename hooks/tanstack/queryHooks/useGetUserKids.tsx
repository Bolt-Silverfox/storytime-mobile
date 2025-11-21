import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../contexts/AuthContext";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";

const useGetUserKids = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["userKids", user?.id],
    queryFn: async () => {
      const response = await apiFetch(`${BASE_URL}/auth/kids`, {
        method: "GET",
      });
      const result = await response.json();
      console.log("get kids result", result);
      return result;
    },
    staleTime: Infinity,
    enabled: !!user,
  });
};

export default useGetUserKids;
