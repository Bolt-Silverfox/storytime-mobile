import { queryOptions } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { LearningExpectation, QueryResponse } from "../../../types";

const queryLearningExpectations = () => {
  return queryOptions({
    queryFn: getLearningExpectations,
    queryKey: ["learningExpectations"],
    staleTime: Infinity,
    select: (res) => res.data,
  });
};

export default queryLearningExpectations;

const getLearningExpectations = async () => {
  try {
    const request = await apiFetch(`${BASE_URL}/auth/learning-expectations`, {
      method: "GET",
    });
    const response: QueryResponse<LearningExpectation[]> = await request.json();
    if (!response.success) {
      throw new Error(response.message);
    }
    return response;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error, try again";
    throw new Error(message);
  }
};
