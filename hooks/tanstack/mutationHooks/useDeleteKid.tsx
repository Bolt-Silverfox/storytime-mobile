import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";

const useDeleteKid = (setError: (err: string) => void) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (kidsIds: Array<string>) => {
      const request = apiFetch(`${BASE_URL}/auth/kids`, {
        method: "DELETE",
        body: JSON.stringify(kidsIds),
      });
      return request;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userKids", user?.id],
      });
    },
    onError: (err) => {
      setError(err.message);
    },
  });
};

export default useDeleteKid;
