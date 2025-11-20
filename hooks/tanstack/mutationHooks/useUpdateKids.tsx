import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";

const useUpdateKids = (setError: (err: string) => void) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (
      kids: {
        id: string;
        name: string;
        avatarUrl: "string";
        ageRange: string;
      }[]
    ) => {
      const promises = kids.map((kid) => {
        return apiFetch(`${BASE_URL}/auth/kids`, {
          method: "PUT",
          body: JSON.stringify(kid),
        });
      });
      const results = await Promise.all(promises);
      console.log("update kids result", results);
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

export default useUpdateKids;
