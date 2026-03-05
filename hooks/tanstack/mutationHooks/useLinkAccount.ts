import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { QUERY_KEYS } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";
import { AuthProvider } from "../../../types";
import auth from "../../../utils/auth";

export const useLinkGoogle = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (idToken: string) => {
      const result = await auth.linkGoogle(idToken);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_LINKED_ACCOUNTS, user?.id],
      });
      onSuccess?.();
    },
    onError: (err) => {
      Alert.alert("Error", err.message || "Failed to link Google account.");
    },
  });
};

export const useLinkApple = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (idToken: string) => {
      const result = await auth.linkApple(idToken);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_LINKED_ACCOUNTS, user?.id],
      });
      onSuccess?.();
    },
    onError: (err) => {
      Alert.alert("Error", err.message || "Failed to link Apple account.");
    },
  });
};

export const useUnlinkProvider = ({
  onSuccess,
}: { onSuccess?: () => void } = {}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (provider: AuthProvider) => {
      const result = await auth.unlinkProvider(provider);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_LINKED_ACCOUNTS, user?.id],
      });
      onSuccess?.();
    },
    onError: (err) => {
      Alert.alert("Error", err.message || "Failed to unlink account.");
    },
  });
};
