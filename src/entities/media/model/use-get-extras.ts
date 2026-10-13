import { useQuery } from "@tanstack/react-query";
import { MEDIA_EXTRAS_QUERY_KEY } from "@/shared/config/query-keys";
import { CacheConfig } from "@/shared/config/cache";
import { getMediaDetails } from "../api/get-media-details";
import { getMediaFullInfo } from "../api/get-media-full-info";
import { Locale } from "next-intl";
import { MediaType } from "@/shared/types/media-types";

export function useGetMediaDetails(
   mediaId: number,
   mediaType: MediaType,
   locale: Locale,
) {
   return useQuery({
      queryKey: [MEDIA_EXTRAS_QUERY_KEY, mediaId, mediaType, "details"],
      queryFn: () => getMediaDetails(String(mediaId), mediaType, locale),
      staleTime: CacheConfig.DETAILS,
      enabled: Number.isInteger(mediaId) && mediaId > 0 && Boolean(mediaType),
   });
}

export function useGetMediaFullInfo(
   mediaId: number,
   mediaType: MediaType,
   locale: Locale,
) {
   return useQuery({
      queryKey: [MEDIA_EXTRAS_QUERY_KEY, mediaId, mediaType, "fullInfo"],
      queryFn: () => getMediaFullInfo(String(mediaId), mediaType, locale),
      staleTime: CacheConfig.DETAILS,
      enabled: Number.isInteger(mediaId) && mediaId > 0 && Boolean(mediaType),
   });
}
