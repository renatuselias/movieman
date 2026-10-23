"use server";

import { tmdbFetch } from "@/shared/api/tmdb-api";
import { CacheConfig } from "@/shared/config/cache";
import { TMDB_LANGUAGES } from "@/shared/config/tmdb-languages";
import { mapToMediaDetails } from "../lib/mappers/media.mapper";
import { MediaType, TMDBMedia } from "@/shared/types/media-types";
import { TMDBMediaCredits } from "@/shared/types/credits-types";
import { translateText } from "@/shared/api/translate-api";

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

      let finalOverview = details.overview;

      if (!finalOverview || finalOverview.trim() === "") {
         const fallbackDetails = await tmdbFetch<TMDBMedia>(
            `/${mediaType}/${mediaId}`,
            { language: "en-US" },
            CacheConfig.DETAILS,
         );

         const englishOverview = fallbackDetails?.overview ?? "";

         if (englishOverview) {
            finalOverview = await translateText(
               englishOverview,
               TMDB_LANGUAGES[locale] ?? locale,
            );
         } else {
            finalOverview = "";
         }
      }

      const results = {
         ...details,
         overview: finalOverview,
         media_type: mediaType,
         cast: credits?.cast || [],
         crew: credits?.crew || [],
      } as TMDBMedia;

      return mapToMediaDetails(results);
      // return results;
   } catch (error) {
      console.error("Failed to fetch media header info:", error);
      return null;
   }
}
