import { useQuery } from "@tanstack/react-query";
import { MEDIA_EXTRAS_QUERY_KEY } from "@/shared/config/query-keys";
import { CacheConfig } from "@/shared/config/cache";
import { getMediaDetails } from "../api/get-media-details";

export function useGetExtras(
   mediaId: number,
   mediaType: "movie" | "tv",
   isFullInfo: boolean = true,
) {
   return useQuery({
      queryKey: [MEDIA_EXTRAS_QUERY_KEY, mediaId, mediaType, isFullInfo],
      queryFn: () => getMediaDetails(String(mediaId), mediaType, isFullInfo),
      staleTime: CacheConfig.DETAILS,
      enabled: Boolean(mediaId && mediaType),
   });
}
