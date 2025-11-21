import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";
import { Alert } from "react-native";
import { User } from "../../../types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useAddKids = (numOfKids: number) => {
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
      const response = await apiFetch(`${BASE_URL}/auth/kids`, {
        method: "POST",
        body: JSON.stringify(kids),
      });
      const results = await response.json();
      console.log("add kids result", results);
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
    },
    onError: (err) => {
      Alert.alert(err.message);
    },
  });
};

export default useAddKids;
