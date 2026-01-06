import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";
import { QueryResponse, UserProfile } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";

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
        if (!userProfile.success) throw new Error(userProfile.message);
        return userProfile;
      } catch (err) {
        throw new Error(getErrorMessage(err));
      }
    },
    refetchOnMount: false,
    staleTime: Infinity,
    select: (res) => res?.data,
  });
};

export default useGetUserProfile;
