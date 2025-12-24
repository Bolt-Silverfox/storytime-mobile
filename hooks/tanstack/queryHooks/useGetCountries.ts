import { useQuery } from "@tanstack/react-query";

type Country = {
  name: {
    common: string;
    official: string;
    nativeName: Record<string, Record<string, string>>;
  };
};
const useGetCountries = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const request = await fetch(
        "https://restcountries.com/v3.1/all?fields=name"
      );
      const response: Country[] = await request.json();
      return response;
    },
    staleTime: Infinity,
    select: (res) =>
      res.sort((a, b) => a.name.common.localeCompare(b.name.common)),
  });
};

export default useGetCountries;
