import { queryOptions } from "@tanstack/react-query";
import useAuth from "../../../contexts/AuthContext";

const useGetNotificationsQuery = () => {
  const { user } = useAuth();
  return queryOptions({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {},
    staleTime: Infinity,
  });
};

export default useGetNotificationsQuery;
