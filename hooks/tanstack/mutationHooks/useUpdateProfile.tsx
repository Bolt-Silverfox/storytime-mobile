import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../../../constants";
import { User } from "../../../types";
import apiFetch from "../../../apiFetch";

export type UpdateUserProfileData = {
  title?: string;
  name?: string;
  avatarUrl?: string;
  language?: string;
  country?: string;
};


export const useUpdateProfile = (userId: string) => {
  const queryClient = useQueryClient();
  console.log(userId);

  return useMutation({
    mutationFn: async (data: UpdateUserProfileData): Promise<User> => {
      if (!userId) throw new Error("User ID not loaded yet");
      const response = await apiFetch(`${BASE_URL}/user/${userId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      const profileUpdate = await response.json();
      console.log(profileUpdate);

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      console.log("response", profileUpdate);

      return profileUpdate;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      queryClient.setQueryData(["profile", userId], data);
    },
  });
};
