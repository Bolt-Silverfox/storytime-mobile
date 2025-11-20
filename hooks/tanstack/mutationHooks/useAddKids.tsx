import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";

const useAddKids = (setError: (err: string) => void) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (
      kids: {
        name: string;
        avatarUrl: "string";
        ageRange: string;
      }[]
    ) => {
      const promises = kids.map((kid) => {
        return apiFetch(`${BASE_URL}/auth/kids`, {
          method: "POST",
          body: JSON.stringify(kid),
        });
      });
      const results = await Promise.all(promises);
      console.log("add kids result", results);
      return results;
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

export default useAddKids;
