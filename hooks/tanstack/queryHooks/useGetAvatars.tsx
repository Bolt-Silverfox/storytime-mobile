import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";

const useGetAvatars = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["kidAvatar"],
    queryFn: async () => {
      try {
        if (user === null || user === undefined) {
          return null;
        }
        const url = `${BASE_URL}/avatars/system`;
        const response = await apiFetch(url, {
          method: "GET",
        });
        const avatars = await response.json();
        return avatars;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "unexpected error, try again";
        throw new Error(message);
      }
    },
  });
};

export default useGetAvatars;
