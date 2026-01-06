import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "../../../utils/utils";
import { BASE_URL } from "../../../constants";
import apiFetch from "../../../apiFetch";
import { QueryResponse } from "../../../types";

const useSetDailyChallenge = () => {
  return useMutation({
    mutationFn: async (data: {
      storyId: string;
      challengeDate: string;
      wordOfTheDay: string;
      meaning: string;
    }) => {
      try {
        const request = await apiFetch(`${BASE_URL}/stories/daily-challenge`, {
          method: "POST",
          body: JSON.stringify(data),
        });
        const response: QueryResponse = await request.json();
        if (!response.success) throw new Error(response.message);
        return response;
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
  });
};

const useAssignDailyChallenge = () => {
  return useMutation({
    mutationFn: async (data: { kidId: string; challengeId: string }) => {
      try {
        const request = await apiFetch(
          `${BASE_URL}/stories/daily-challenge/assign`,
          {
            method: "POST",
            body: JSON.stringify(data),
          }
        );
        const response: QueryResponse = await request.json();
        if (!response.success) throw new Error(response.message);
        return response;
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
  });
};

const useMarkDailyChallengeAsComplete = () => {
  return useMutation({
    mutationFn: async (data: { assignmentId: string }) => {
      try {
        const request = await apiFetch(
          `${BASE_URL}/stories/daily-challenge/complete`,
          {
            method: "POST",
            body: JSON.stringify(data),
          }
        );
        const response: QueryResponse = await request.json();
        if (!response.success) throw new Error(response.message);
        return response;
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
  });
};

export {
  useSetDailyChallenge,
  useAssignDailyChallenge,
  useMarkDailyChallengeAsComplete,
};
