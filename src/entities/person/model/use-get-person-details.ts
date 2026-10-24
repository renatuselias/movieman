import { useQuery } from "@tanstack/react-query";
import { PERSON_EXTRAS_QUERY_KEY } from "@/shared/config/query-keys";
import { CacheConfig } from "@/shared/config/cache";
import { getPersonDetail } from "../api/get-person-details";

export function useGetPersonDetails(personId: number | string) {
   return useQuery({
      queryKey: [PERSON_EXTRAS_QUERY_KEY, personId],
      queryFn: () => getPersonDetail(personId),
      staleTime: CacheConfig.DETAILS,
      enabled: Boolean(personId),
   });
}
