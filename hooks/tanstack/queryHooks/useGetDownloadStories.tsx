import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";

type DownloadedStories = {
  id: string;
  kidId: string;
  storyId: string;
  downloadedAt: string;
};

type Response = {
  data: DownloadedStories[];
  message: string;
  statusCode: number;
  success: boolean;
};

const useGetDownloadStories = (kidId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["downloadStories", kidId],
    queryFn: async () => {
      try {
        if (!user) return null;
        const url = `${BASE_URL}/stories/library/${kidId}/downloads`;
        const response = await apiFetch(url, {
          method: "GET",
        });

        if (!response.ok) {
          const errJson = await response.json().catch(() => null);
          const msg =
            errJson?.message || `Failed with status ${response.status}`;
          throw new Error(msg);
        }

        const stories: Response = await response.json();
        console.log("stories:", stories);
        return stories; // replace `any` with your Story type if available
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "unexpected error, try again";
        throw new Error(message);
      }
    },
    select: (data) => data?.data,
    enabled: !!user,
  });
};

export default useGetDownloadStories;
