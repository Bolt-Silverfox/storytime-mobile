import { queryOptions } from "@tanstack/react-query";
import { getErrorMessage } from "../../../utils/utils";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse } from "../../../types";

const queryDailyChallengeByDate = (date: string) => {
  return queryOptions({
    queryKey: ["dailyChallengeByDate", date],
    queryFn: async () => {
      try {
        const request = await apiFetch(
          `${BASE_URL}/stories/daily-challenge?date=${date}`,
          { method: "GET" }
        );
        const response: QueryResponse = await request.json();
        if (!response.success) throw new Error(response.message);
        return response;
      } catch (err) {
        throw new Error(getErrorMessage(err));
      }
    },
    select: (res) => res.data,
    staleTime: Infinity,
  });
};
// what format will this date be in?

const queryDailyChallengeForKid = (kidId: string) => {
  return queryOptions({
    queryKey: ["kidDailyChallenge", kidId],
    queryFn: async () => {
      try {
        const request = await apiFetch(
          `${BASE_URL}/stories/daily-challenge/kid/${kidId}`,
          { method: "GET" }
        );
        const response: QueryResponse = await request.json();
        if (!response.success) throw new Error(response.message);
        return response;
      } catch (err) {
        throw new Error(getErrorMessage(err));
      }
    },
    select: (res) => res.data,
    staleTime: Infinity,
  });
};

const queryDailyChallengeAssignment = (assignmentId: string) => {
  return queryOptions({
    queryKey: ["dailyChallengeAssignment", assignmentId],
    queryFn: async () => {
      try {
        const request = await apiFetch(
          `${BASE_URL}/stories/daily-challenge/assignment/${assignmentId}`,
          { method: "GET" }
        );
        const response: QueryResponse = await request.json();
        if (!response.success) throw new Error(response.message);
        return response;
      } catch (err) {
        throw new Error(getErrorMessage(err));
      }
    },
    select: (res) => res.data,
    staleTime: Infinity,
  });
};

const queryTodaysDailyChallenge = (kidId: string) => {
  return queryOptions({
    queryKey: ["todaysDailyChallenge", kidId],
    queryFn: async () => {
      try {
        const request = await apiFetch(
          `${BASE_URL}/stories/daily-challenge/today?kidId=${kidId}`,
          { method: "GET" }
        );
        const response: QueryResponse = await request.json();
        if (!response.success) throw new Error(response.message);
        return response;
      } catch (err) {
        throw new Error(getErrorMessage(err));
      }
    },
    select: (res) => res.data,
    staleTime: Infinity,
  });
};

const queryWeeklyDailyChallenge = (kidId: string, weekStart: string) => {
  // weekstart yyyy-mm--dd must be a sunday
  return queryOptions({
    queryKey: ["weeklyDailyChallenge", kidId],
    queryFn: async () => {
      try {
        const request = await apiFetch(
          `${BASE_URL}/stories/daily-challenge/kid/${kidId}/week?weekStart=${weekStart}`,
          { method: "GET" }
        );
        const response: QueryResponse = await request.json();
        if (!response.success) throw new Error(response.message);
        return response;
      } catch (err) {
        throw new Error(getErrorMessage(err));
      }
    },
    select: (res) => res.data,
    staleTime: Infinity,
  });
};

export {
  queryDailyChallengeByDate,
  queryDailyChallengeForKid,
  queryDailyChallengeAssignment,
  queryTodaysDailyChallenge,
  queryWeeklyDailyChallenge,
};
