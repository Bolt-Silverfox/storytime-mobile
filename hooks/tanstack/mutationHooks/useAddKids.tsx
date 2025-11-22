import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";
import { User } from "../../../types";

const useAddKids = (numOfKids: number, redirect?: () => void) => {
  const queryClient = useQueryClient();

  const { user, setUser } = useAuth();
  return useMutation({
    mutationFn: async (
      kids: {
        name: string;
        avatarUrl?: string;
        ageRange: string;
      }[]
    ) => {
      const invalid = kids.some(
        (kid) => !kid.name.trim().length || !kid.ageRange.trim().length
      );

      if (invalid) {
        return Promise.reject(
          "Invalid child data, All fields are required for each child"
        );
        return;
      }
      const response = await apiFetch(`${BASE_URL}/auth/kids`, {
        method: "POST",
        body: JSON.stringify(kids),
      });
      const results = await response.json();
      return results;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["userKids"],
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
