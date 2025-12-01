import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../contexts/AuthContext";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";

type ReportType = {
  statusCode: number;
  success: boolean;
  data: KidStats;
  message: string;
};

export type KidStats = {
  kidId: string;
  kidName: string;
  avatarUrl: string | null;
  screenTimeMins: number;
  screenTimeLimitMins: number | null;
  storiesCompleted: number;
  storiesInProgress: number;
  rightAnswers: number;
  totalAnswers: number;
  accuracyPercentage: number;
  starsEarned: number;
  badgesEarned: number;
  favoritesCount: number;
};

const useGetReportByKidId = (kidId: string) => {
  return useQuery({
    queryKey: ["userReportByKidId", kidId],
    queryFn: async () => {
      const response = await apiFetch(`${BASE_URL}/reports/kid/${kidId}`, {
        method: "GET",
      });
      const result: ReportType = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    enabled: !!kidId,
    select: (res) => res.data,
  });
};

export default useGetReportByKidId;
