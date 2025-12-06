import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse } from "../../../types";
import { useNavigation } from "@react-navigation/native";
import { ParntHomeNavigatorProp } from "../../../Navigation/ParentHomeNavigator";

type GenerateStory = {
  ageMax: number;
  ageMin: number;
  aiGenerated: boolean;
  audioUrl: string;
  coverImageUrl: string;
  createdAt: string;
  creatorKidId: string;
  deletedAt: null | string;
  description: string;
  difficultyLevel: number;
  id: string;
  isDeleted: boolean;
  isInteractive: boolean;
  language: string;
  questions: {};
  recommended: boolean;
  textContent: string;
  themes: {};
  title: string;
  updatedAt: string;
};

const useCreateStory = ({
  kidId,
  onSuccess,
}: {
  kidId: string;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  console.log("kid id", kidId);
  return useMutation({
    mutationFn: async (data: { theme: string; category?: string }) => {
      const url = `${BASE_URL}/stories/generate/kid/${kidId}`;
      const request = await apiFetch(url, {
        method: "POST",
        body: JSON.stringify({ ...data, kidId }),
      });
      const response: QueryResponse<GenerateStory> = await request.json();
      console.log("response", response);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (data) => {
      console.log("data onsuccess", data);
      queryClient.invalidateQueries({
        queryKey: ["generatedStories"],
      });
      navigator.navigate("plainStories", {
        storyId: data.data.id,
        mode: "plain",
      });

      onSuccess?.();
    },
    onError: (err) => {
      Alert.alert(err.message ?? "Unexpected error, try again later");
    },
  });
};

export default useCreateStory;
