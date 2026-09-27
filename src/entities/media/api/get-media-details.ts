"use server";

import { tmdbFetch } from "@/shared/api/tmdb-api";
import { CacheConfig } from "@/shared/config/cache";
import { TMDB_LANGUAGES } from "@/shared/config/tmdb-languages";
import { getLocale } from "next-intl/server";
import { mapToHeaderInfo } from "../lib/mappers/media.mapper";

export type MediaType = "movie" | "tv";

export async function getMediaDetails(
   mediaId: string,
   mediaType: MediaType = "movie",
   isFoolInfo: boolean,
) {
   try {
      const locale = await getLocale();
      const language = TMDB_LANGUAGES[locale] ?? locale;

      const creditsEndpoint =
         mediaType === "movie" ? "credits" : "aggregate_credits";

      const [details, credits, recommendations] = await Promise.all([
         tmdbFetch(
            `/${mediaType}/${mediaId}`,
            {
               language,
               append_to_response: "videos,images",
               include_image_language: `${locale}`,
            },
            CacheConfig.DETAILS,
         ),
         isFoolInfo
            ? tmdbFetch(
                 `/${mediaType}/${mediaId}/${creditsEndpoint}`,
                 { language },
                 CacheConfig.DETAILS,
              )
            : null,
         isFoolInfo
            ? tmdbFetch(
                 `/${mediaType}/${mediaId}/recommendations`,
                 { language },
                 CacheConfig.LISTS,
              )
            : null,
      ]);

      if (!details || details.status_code === 34) {
         return null;
      }

      if (!isFoolInfo) {
         const results = {
            ...details,
            media_type: mediaType,
         };
         return mapToHeaderInfo(results);
      }

      let videos = details?.videos;
      if (!videos?.results?.length) {
         const fallbackVideos = await tmdbFetch(
            `/${mediaType}/${mediaId}/videos`,
            { language },
            CacheConfig.DETAILS,
         );
         videos = fallbackVideos ?? videos;
      }

      return {
         ...details,
         cast: credits?.cast || [],
         crew: credits?.crew || [],
         recommendations,
      };
   } catch (error) {
      console.error("Failed to fetch media details:", error);
      return null;
   }
}
