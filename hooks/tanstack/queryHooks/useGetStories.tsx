import { useQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";
import useAuth from "../../../contexts/AuthContext";

const useGetStories = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["stories", user?.id],
    queryFn: async () => {
      try {
        if (!user) return null;
        const url = `${BASE_URL}/stories`;
        const response = await apiFetch(url, {
          method: "GET",
        });

        if (!response.ok) {
          const errJson = await response.json().catch(() => null);
          const msg = errJson?.message || `Failed with status ${response.status}`;
          throw new Error(msg);
        }

        const stories = await response.json();
        console.log("stories:", stories);
        return stories as any[]; // replace `any` with your Story type if available
      } catch (err) {
        const message = err instanceof Error ? err.message : "unexpected error, try again";
        throw new Error(message);
      }
    },
    enabled: !!user,
  });
};

export default useGetStories;
