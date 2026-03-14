import { useMutation } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse } from "../../../types";
import { quizLogger } from "../../../utils/logger";

const useSubmitQuizAnswer = () => {
  return useMutation({
    mutationFn: async ({
      questionId,
      storyId,
      selectedOption,
    }: {
      questionId: string;
      storyId: string;
      selectedOption: number;
    }) => {
      const url = `${BASE_URL}/reports/answer`;
      const response = await apiFetch(url, {
        method: "POST",
        body: JSON.stringify({
          questionId,
          storyId,
          selectedOption,
        }),
      });
      const data: QueryResponse = await response.json();
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onError: (error) => {
      // Fire-and-forget — don't block quiz UI on submission errors
      quizLogger.warn("Quiz answer submission failed:", error);
    },
  });
};

export default useSubmitQuizAnswer;
