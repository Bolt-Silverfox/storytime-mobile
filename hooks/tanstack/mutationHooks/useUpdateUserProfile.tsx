import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";

const useUpdateUserProfile = (setError: (err: string) => void) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (data: {
      name?: string;
      avatarUrl?: "string";
      language?: "string";
      country?: "string";
      title?: "string";
    }) => {
      const request = apiFetch(`${BASE_URL}/user/${user?.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      console.log("update profile request", request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userProfile", user?.id],
      });
    },
    onError: (err) => {
      setError(err.message);
    },
  });
};

export default useUpdateUserProfile;
