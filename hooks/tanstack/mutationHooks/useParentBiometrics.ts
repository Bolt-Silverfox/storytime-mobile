import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { getErrorMessage } from "../../../utils/utils";
import useGetUserProfile from "../queryHooks/useGetUserProfile";
import { QueryResponse } from "../../../types";

const useEnableBiometrics = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  const { data } = useGetUserProfile();
  return useMutation({
    mutationFn: async () => {
      try {
        const request = await apiFetch(`${BASE_URL}/biometrics/enable`, {
          method: "POST",
        });
        const response: QueryResponse = await request.json();
        if (!response.success) throw new Error(response.message);
        return response;
      } catch (err) {
        throw new Error(getErrorMessage(err));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userProfile", data?.id],
      });
      Alert.alert("biometrics enabled successfully");
      onSuccess?.();
    },
    onError: (err) => {
      throw new Error(err.message);
    },
  });
};

const useDisableBiometrics = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  const { data } = useGetUserProfile();
  return useMutation({
    mutationFn: async () => {
      try {
        const request = await apiFetch(`${BASE_URL}/biometrics/disable`, {
          method: "POST",
        });
        const response: QueryResponse = await request.json();
        if (!response.success) throw new Error(response.message);
        return response;
      } catch (err) {
        throw new Error(getErrorMessage(err));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userProfile", data?.id],
      });
      Alert.alert("Biometrics disabled successfully");
      onSuccess?.();
    },
    onError: (err) => {
      throw new Error(err.message);
    },
  });
};

export { useEnableBiometrics, useDisableBiometrics };
