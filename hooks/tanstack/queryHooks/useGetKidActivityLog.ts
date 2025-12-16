import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse } from "../../../types";

type ActivityLog = {
  id: string;
  userId: string;
  kidId: string;
  action: string;
  status: string;
  deviceName: string;
  deviceModel: string;
  os: string;
  ipAddress: string;
  details: string;
  createdAt: string;
};

const useGetKidActivityLog = (id: string) => {
  return useQuery({
    queryKey: ["activityLog", id],
    queryFn: async () => {
      const URL = `${BASE_URL}/activity-logs/kid/${id}`;
      const request = await apiFetch(URL, {
        method: "GET",
      });
      const response: QueryResponse<ActivityLog[]> = await request.json();
      if (!response.success) throw new Error(response.message);
      return response;
    },
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    select: (res) => res.data,
  });
};

export default useGetKidActivityLog;
