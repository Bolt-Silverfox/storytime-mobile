import { useSuspenseQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import type { Story } from "./useGetStories";

type StoryRequest = {
    statusCode: number;
    success: boolean;
    data: Story[];
    message: string;
};

const useGetRecommendedStories = (limit = 50) => {
    return useSuspenseQuery({
        queryKey: ["getStories", "recommended", String(limit)],
        queryFn: async () => {
            const url = `${BASE_URL}/stories?recommended=true&limit=${encodeURIComponent(
                String(limit)
            )}`;
            const req = await apiFetch(url, { method: "GET" });
            const res: StoryRequest = await req.json();
            if (!res.success) throw new Error(res.message ?? "Failed to load stories");
            console.log("Recommended stories", res.data);

            return res;
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        select: (r) => r.data,
    });
};

export default useGetRecommendedStories;
export type { StoryRequest };
