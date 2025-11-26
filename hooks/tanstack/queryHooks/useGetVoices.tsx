import { useSuspenseQuery } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL } from "../../../constants";

type getVoicesType = {
  statusCode: number;
  success: boolean;
  data: {
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
  }[];

  message: string;
};

const useGetVoices = () => {
  return useSuspenseQuery({
    queryKey: ["voices"],
    queryFn: async () => {
      const URL = `${BASE_URL}/stories/voices/available`;
      const request = await apiFetch(URL, {
        method: "GET",
      });
      const response: getVoicesType = await request.json();
      if (!response.success) throw new Error(response.message);
      return response;
    },
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    select: (res) => res.data,
  });
};

export default useGetVoices;
