import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";
import { User } from "../../../types";

type Kid = {
  id: string;
  name: string;
  ageRange: string;
  avatarUrl?: string;
};

const useAddKids = (numOfKids: number, redirect?: () => void) => {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuth();

  return useMutation({
    mutationFn: async (
      kids: {
        name: string;
        avatarId: string;
        ageRange: string;
      }[]
    ) => {
      const invalid = kids.some(
        (kid) => !kid.name.trim().length || !kid.ageRange.trim().length
      );
      if (invalid) {
        throw new Error("Invalid child data, All fields are required.");
      }

      const normalizedNames = kids.map((k) => k.name.trim().toLowerCase());
      const hasInternalDuplicate = normalizedNames.some(
        (name, i) => normalizedNames.indexOf(name) !== i
      );
      if (hasInternalDuplicate) {
        throw new Error("Two kids cannot have the same name.");
      }

      const cachedResponse = queryClient.getQueryData<{
        success: boolean;
        message: string;
        data: Kid[];
      }>(["userKids", user?.id]);

      const existingKids = cachedResponse?.data ?? [];
      const duplicate = normalizedNames.some((name) =>
        existingKids.some((kid) => kid.name.trim().toLowerCase() === name)
      );
      if (duplicate) {
        throw new Error("Kid already exists, use another name.");
      }

      const response = await apiFetch(`${BASE_URL}/auth/kids`, {
        method: "POST",
        body: JSON.stringify(kids),
      });
      const results = await response.json();
      if (!results.success) {
        throw new Error(results.message);
      }
      return results;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["userKids", user?.id],
      });

      if (!user) return;

      const updatedUser: User = {
        ...user,
        numberOfKids: user.numberOfKids + numOfKids,
      };
      setUser(updatedUser);
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

      if (redirect) {
        redirect();
      }
    },
    onError: (err: Error | string) => {
      const message = err instanceof Error ? err.message : err;
      Alert.alert(message);
    },
  });
};

export default useAddKids;
