import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import { Avatar } from "../../../types";

type KidData = {
  id: string;
  name: string;
  avatarId: string | null;
  ageRange: string;
  dailyScreenTimeLimitMins: null | number;
  parentId: string;
  currentReadingLevel: number;
  createdAt: string;
  updatedAt: string;
  preferredVoiceId: string;
  excludedTags: string[];
  isBedtimeEnabled: boolean;
  bedtimeStart: string | null;
  bedtimeEnd: string | null;
  bedtimeDays: number[];
  bedtimeLockApp: boolean;
  bedtimeDimScreen: boolean;
  bedtimeReminder: boolean;
  bedtimeStoriesOnly: boolean;
  avatar: Avatar | null;
  parent: {
    id: string;
    name: string;
    email: string;
  };
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
