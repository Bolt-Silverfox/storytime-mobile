import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";
import { LinkedAccount, QueryResponse } from "../../../types";
import auth from "../../../utils/auth";
import { getErrorMessage } from "../../../utils/utils";

const useGetLinkedAccounts = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.GET_LINKED_ACCOUNTS, user?.id],
    queryFn: async () => {
      try {
        if (!user) return null;
        const result: QueryResponse<LinkedAccount[]> =
          await auth.getLinkedAccounts();
        if (!result.success) throw new Error(result.message);
        return result;
      } catch (err) {
        throw new Error(getErrorMessage(err));
      }
    },
    enabled: !!user,
    select: (res) => res?.data,
  });
};

export default useGetLinkedAccounts;
