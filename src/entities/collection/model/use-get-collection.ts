import { CacheConfig } from "@/shared/config/cache";
import { COLLECTION_EXTRAS_QUERY_KEY } from "@/shared/config/query-keys";
import { useQuery } from "@tanstack/react-query";
import { Locale } from "next-intl";
import { getCollection } from "../api/get-collection";

export function useGetCollection(collectionId: number, locale: Locale) {
   return useQuery({
      queryKey: [COLLECTION_EXTRAS_QUERY_KEY, collectionId],
      queryFn: () => getCollection(String(collectionId), locale),
      staleTime: CacheConfig.DETAILS,
      enabled: Number.isInteger(collectionId) && collectionId > 0,
   });
}
