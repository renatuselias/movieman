import { useQuery } from "@tanstack/react-query";
import { MEDIAS_QUERY_KEY } from "@/shared/config/query-keys";
import { CacheConfig } from "@/shared/config/cache";
import { getTrendingMedia } from "../api/get-trending-media";
import { Locale } from "next-intl";

interface GetMediasProps {
   shouldFetch: boolean;
   locale: Locale;
   limit: number;
}

export function useGetMedias({ shouldFetch, locale, limit }: GetMediasProps) {
   return useQuery({
      queryKey: [MEDIAS_QUERY_KEY],
      queryFn: () =>
         getTrendingMedia({
            timeWindow: "week",
            locale,
            limit,
            mediaType: "tv",
         }),
      staleTime: CacheConfig.LISTS,
      enabled: shouldFetch,
   });
}
