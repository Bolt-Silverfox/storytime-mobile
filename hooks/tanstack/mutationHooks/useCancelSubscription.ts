import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "../../../utils/utils";
import apiFetch from "../../../apiFetch";
import { BASE_URL, QUERY_KEYS } from "../../../constants";
import { QueryResponse } from "../../../types";
import { Alert } from "react-native";
import useAuth from "../../../contexts/AuthContext";

const useCancelSubscription = (onSuccessCb?: () => void) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SUBSCRIPTION_STATUS, user?.id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_PROFILE, user?.id],
      });
      onSuccessCb?.();
    },
    onError: (err) => {
      Alert.alert("Payment cancellation failed", err.message);
      if (__DEV__) console.error("Cancel payment error", err);
    },
  });
};

export default useCancelSubscription;

const cancelSubscription = async () => {
  try {
    const request = await apiFetch(`${BASE_URL}/payment/cancel`, {
      method: "POST",
    });
    const response: QueryResponse = await request.json();
    if (!response.success) throw new Error(response.message);
    return response;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
};
