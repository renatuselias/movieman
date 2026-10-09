"use server";

import { tmdbFetch } from "@/shared/api/tmdb-api";
import { CacheConfig } from "@/shared/config/cache";
import { TMDB_LANGUAGES } from "@/shared/config/tmdb-languages";
import { getLocale } from "next-intl/server";
import { TMDBMedia, TMDBVideo } from "@/shared/types/media-types";
import { TMDBMediaCredits } from "@/shared/types/credits-types";
import { MediaType } from "../model/types";

export async function getMediaFullInfo(
   mediaId: string,
   mediaType: MediaType = "movie",
) {
   try {
      const locale = await getLocale();
      const language = TMDB_LANGUAGES[locale] ?? locale;
      const creditsEndpoint =
         mediaType === "movie" ? "credits" : "aggregate_credits";

      const [details, credits, recommendations] = await Promise.all([
         tmdbFetch<TMDBMedia>(
            `/${mediaType}/${mediaId}`,
            {
               language,
               append_to_response: "videos,images",
               include_image_language: `${locale}`,
            },
            CacheConfig.DETAILS,
         ),
         tmdbFetch<TMDBMediaCredits>(
            `/${mediaType}/${mediaId}/${creditsEndpoint}`,
            { language },
            CacheConfig.DETAILS,
         ),
         tmdbFetch(
            `/${mediaType}/${mediaId}/recommendations`,
            { language },
            CacheConfig.LISTS,
         ),
      ]);

      if (
         !details ||
         ("status_code" in details && details.status_code === 34)
      ) {
         return null;
      }

      type TMDBVideosResponse = { results: TMDBVideo[] };
      let videos: TMDBVideo[] = details?.videos?.results ?? [];

      if (!videos.length) {
         const fallbackVideos = await tmdbFetch<TMDBVideosResponse>(
            `/${mediaType}/${mediaId}/videos`,
            { language },
            CacheConfig.DETAILS,
         );
         videos = fallbackVideos?.results ?? [];
      }

      return {
         ...details,
         videos,
         cast: credits?.cast || [],
         crew: credits?.crew || [],
         recommendations,
      };
   } catch (error) {
      console.error("Failed to fetch full media details:", error);
      return null;
   }
}
