import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";
import { QueryResponse, UserProfile } from "../../../types";

const useGetUserProfile = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: async () => {
      try {
        if (user === null || user === undefined) {
          return null;
        }
        const url = `${BASE_URL}/user/me`;
        const response = await apiFetch(url, {
          method: "GET",
        });
        const userProfile: QueryResponse<UserProfile> = await response.json();
        return userProfile;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "unexpected error, try again";
        throw new Error(message);
      }
    },
  });
};

export default useGetUserProfile;
