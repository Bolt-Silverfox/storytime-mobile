import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { QueryResponse } from "../../../types";

type ActivityLog = {
  voice_id: string;
  name: string;
  category: string;
  samples: string | null;
  description: string;
  preview_url: string;
  label: {
    accent: string;
    gender: string;
    age: string;
  };
};

const useGetKidActivityLog = (id: string) => {
  console.log("kidid", id);
  return useQuery({
    queryKey: ["activityLog", id],
    queryFn: async () => {
      const URL = `${BASE_URL}/activity-logs/kid/${id}`;
      const request = await apiFetch(URL, {
        method: "GET",
      });
      const response: QueryResponse<ActivityLog[]> = await request.json();
      console.log("activity log", response);
      if (!response.success) throw new Error(response.mesage);
      return response;
    },
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    select: (res) => res.data,
  });
};

export default useGetKidActivityLog;
