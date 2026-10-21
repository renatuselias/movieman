"use server";

import { tmdbFetch } from "@/shared/api/tmdb-api";
import { CacheConfig } from "@/shared/config/cache";
import { TMDB_LANGUAGES } from "@/shared/config/tmdb-languages";
import {
   MediaType,
   TMDBMedia,
   TMDBPaginatedResponse,
   TMDBVideo,
} from "@/shared/types/media-types";
import { TMDBMediaCredits } from "@/shared/types/credits-types";
import { Locale } from "next-intl";
import { mapToFullMedia } from "../lib/mappers/media.mapper";

export async function getMediaFullInfo(
   mediaId: string,
   mediaType: MediaType = "movie",
   locale: Locale,
) {
   try {
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
         tmdbFetch<TMDBPaginatedResponse<TMDBMedia>>(
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
      let videos: TMDBVideo[] = details.videos?.results ?? [];

      if (!videos.length) {
         const fallbackVideos = await tmdbFetch<TMDBVideosResponse>(
            `/${mediaType}/${mediaId}/videos`,
            { language },
            CacheConfig.DETAILS,
         );
         videos = fallbackVideos?.results ?? [];
      }

      const results = {
         ...details,
         media_type: mediaType,
         videos: { ...details.videos, results: videos },
         cast: credits?.cast || [],
         crew: credits?.crew || [],
         recommendations: recommendations ?? { results: [] },
      } as TMDBMedia;

      // return results;
      return mapToFullMedia(results);
   } catch (error) {
      console.error("Failed to fetch full media details:", error);
      return null;
   }
}
