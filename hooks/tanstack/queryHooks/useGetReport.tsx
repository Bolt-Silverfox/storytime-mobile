import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../contexts/AuthContext";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { WeeklyReport } from "../../../types";

type ReportType = {
  statusCode: number;
  success: boolean;
  data: WeeklyReport;
  message: string;
};

const useGetReport = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["userReport", user?.id],
    queryFn: async () => {
      const response = await apiFetch(
        `${BASE_URL}/reports/weekly/${user?.id}`,
        {
          method: "GET",
        }
      );
      const result: ReportType = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    staleTime: Infinity,
    enabled: !!user,
    select: (res) => res.data,
  });
};

export default useGetReport;
