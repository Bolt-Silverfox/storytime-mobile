// hooks/useGetKidWeeklyChallenges.ts
import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";

export type DailyChallengeAssignment = {
    id: string;
    kidId: string;
    challengeId: string;
    completed: boolean;
    completedAt?: string | null;
    assignedAt?: string | null;
};

type WeeklyChallengeRequestWrapped = {
    statusCode?: number;
    success?: boolean;
    data?: DailyChallengeAssignment[];
    message?: string;
};

const buildUrl = (kidId: string, weekStart: string) =>
    `${BASE_URL}/stories/daily-challenge/kid/${encodeURIComponent(
        kidId
    )}/week?weekStart=${encodeURIComponent(weekStart)}`;

const useGetKidWeeklyChallenges = (
    kidId?: string | null,
    weekStart?: string | null // should be YYYY-MM-DD (must be a Sunday per API)
) => {
    const { user } = useAuth();

    return useQuery<DailyChallengeAssignment[] | null, Error>({
        queryKey: ["getKidWeeklyChallenges", kidId, weekStart],
        queryFn: async () => {
            if (!kidId || !weekStart) return null;

            const url = buildUrl(kidId, weekStart);
            const response = await apiFetch(url, { method: "GET" });

            const json:
                | WeeklyChallengeRequestWrapped
                | DailyChallengeAssignment[]
                | null = await response.json().catch(() => null);

            if (!response.ok) {
                const msg =
                    (json && typeof json === "object" && "message" in json
                        ? (json as WeeklyChallengeRequestWrapped).message
                        : `Request failed with status ${response.status}`) || `Request failed`;
                throw new Error(msg);
            }

            if (json && typeof json === "object" && "success" in json) {
                const wrapped = json as WeeklyChallengeRequestWrapped;
                if (!wrapped.success) {
                    throw new Error(wrapped.message ?? "Unexpected error from server");
                }
                return (wrapped.data ?? []) as DailyChallengeAssignment[];
            }
            console.log(json);

            // Otherwise assume raw array or null
            return (json as DailyChallengeAssignment[]) ?? null;
        },
        enabled: !!kidId && !!weekStart && !!user,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
        select: (data) => data ?? null,
    });
};

export default useGetKidWeeklyChallenges;
