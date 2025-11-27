import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";

type KidData = {
  activityLogs: any[];
  ageRange: string;
  avatarId: string;
  bedtimeDays: number[];
  bedtimeEnd: string | null;
  bedtimeStart: string | null;
  createdAt: string;
  currentReadingLevel: number;
  dailyScreenTimeLimitMins: number | null;
  excludedTags: string[];
  id: string;
  isBedtimeEnabled: boolean;
  name: string;
  notificationPreferences: any[];
  parentId: string;
  preferredCategories: {
    description: string;
    id: string;
    image: string;
    name: string;
  }[];
  preferredVoiceId: null | string;
  updatedAt: string;
};

type Response = {
  data: KidData;
  success: boolean;
  message: string;
  statusCode: number;
};

const useGetKidById = (id: string) => {
  return useQuery({
    queryKey: ["kidById", id],
    queryFn: async () => {
      const url = `${BASE_URL}/user/kids/${id}`;
      const request = await apiFetch(url, {
        method: "GET",
      });
      const response: Response = await request.json();
      if (!response.success) {
        throw new Error(response.message ?? "Unexpected error, try again");
      }
      return response;
    },
    retryOnMount: false,
    refetchOnWindowFocus: false,
    select: (res) => res.data,
  });
};

export default useGetKidById;
