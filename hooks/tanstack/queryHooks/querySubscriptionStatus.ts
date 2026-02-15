import { queryOptions } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL, QUERY_KEYS } from "../../../constants";
import { QueryResponse, SubscriptionStatus } from "../../../types";
import { getErrorMessage } from "../../../utils/utils";

const querySubscriptionStatus = (userId: string | null | undefined) =>
  queryOptions({
    queryKey: [QUERY_KEYS.GET_SUBSCRIPTION_STATUS, userId],
    queryFn: getSubscriptionStatus,
    staleTime: Infinity,
    enabled: !!userId,
    gcTime: Infinity,
    select: (res) => res.data,
  });

const getSubscriptionStatus = async () => {
  try {
    const request = await apiFetch(`${BASE_URL}/payment/status`, {
      method: "GET",
    });
    const response: QueryResponse<SubscriptionStatus> = await request.json();
    if (!response.success) throw new Error(response.message);
    return response;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
};

export default querySubscriptionStatus;
