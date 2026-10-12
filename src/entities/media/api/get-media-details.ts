"use server";

import { tmdbFetch } from "@/shared/api/tmdb-api";
import { CacheConfig } from "@/shared/config/cache";
import { TMDB_LANGUAGES } from "@/shared/config/tmdb-languages";
import { mapToMediaDetails } from "../lib/mappers/media.mapper";
import { TMDBMedia } from "@/shared/types/media-types";
import { TMDBMediaCredits } from "@/shared/types/credits-types";
import { MediaType } from "../model/types";

export async function getMediaDetails(
   mediaId: string,
   mediaType: MediaType = "movie",
   locale: string,
) {
   try {
      const language = TMDB_LANGUAGES[locale] ?? locale;
      const creditsEndpoint =
         mediaType === "movie" ? "credits" : "aggregate_credits";

      const [details, credits] = await Promise.all([
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
      ]);

      if (
         !details ||
         ("status_code" in details && details.status_code === 34)
      ) {
         return null;
      }

      const results = {
         ...details,
         media_type: mediaType,
         cast: credits?.cast || [],
         crew: credits?.crew || [],
      } as TMDBMedia;

      return mapToMediaDetails(results);
      //return results;
   } catch (error) {
      console.error("Failed to fetch media header info:", error);
      return null;
   }
}
