import { CacheConfig } from "@/shared/config/cache";
import {
   MEDIAS_DISCOVER_QUERY_KEY,
   NOW_IN_CINEMA_QUERY_KEY,
} from "@/shared/config/query-keys";
import { FetchMediaParams } from "@/shared/types/media-types";
import { useQuery } from "@tanstack/react-query";
import { getMedias } from "../api/get-medias";

interface GetMediasProps extends FetchMediaParams {
   enabled?: boolean;
}

export function useGetMedias({
   endpoint,
   mediaType = "movie",
   providerId,
   genreId,
   voteCountGte,
   withoutGenres,
   releaseDateGte,
   releaseDateLte,
   withOriginalLanguage,
   withOriginCountry,
   sortBy = "popularity.desc",
   region = "US",
   page = 1,
   limit,
   isCarousel,
   enabled = true,
}: GetMediasProps) {
   const queryKey = endpoint
      ? [NOW_IN_CINEMA_QUERY_KEY, endpoint, mediaType, isCarousel, limit, page]
      : [
           MEDIAS_DISCOVER_QUERY_KEY,
           mediaType,
           genreId,
           providerId,
           voteCountGte,
           withoutGenres,
           releaseDateGte,
           releaseDateLte,
           withOriginalLanguage,
           withOriginCountry,
           sortBy,
           region,
           page,
           isCarousel,
           limit,
        ];
   return useQuery({
      queryKey,
      queryFn: () =>
         getMedias({
            endpoint,
            mediaType,
            providerId,
            genreId,
            voteCountGte,
            withoutGenres,
            releaseDateGte,
            releaseDateLte,
            withOriginalLanguage,
            withOriginCountry,
            sortBy,
            region,
            page,
            limit,
            isCarousel,
         }),
      staleTime: CacheConfig.DETAILS,
      enabled,
   });
}
