// hooks/useGetParentFavorites.ts
import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";

export type ParentFavorite = {
    id: string;
    parentId: string;
    storyId: string;
    createdAt: string;
};

const useGetParentFavorites = () => {
    const { user } = useAuth();

    return useQuery<ParentFavorite[], Error>({
        queryKey: ["parentFavorites"], // no params needed
        queryFn: async () => {
            if (!user?.id) return [];

            const response = await apiFetch(`${BASE_URL}/parent-favorites`, {
                method: "GET",
            });

            const json = await response.json().catch(() => null);
            console.log("GET /parent-favorites ->", response.status, json);
            if (!response.ok) {
                const msg =
                    (json && json.message) ||
                    `Request failed with status ${response.status}`;
                throw new Error(msg);
            }

            return (json as ParentFavorite[]) ?? [];
        },
        enabled: !!user, // only load when logged in
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};

export default useGetParentFavorites;
