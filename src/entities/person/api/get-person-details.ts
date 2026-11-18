"use server";

import { TMDB_LANGUAGES } from "@/shared/config/tmdb-languages";
import { TmdbPersonDetail } from "../model/types";
import { tmdbFetch } from "@/shared/api/tmdb-api";
import { Locale } from "next-intl";
import { translateText } from "@/shared/api/translate-api";
import { CacheConfig } from "@/shared/config/cache";

export async function getPersonDetail(
   personId: number | string,
   locale: Locale,
): Promise<TmdbPersonDetail | null> {
   const language = TMDB_LANGUAGES[locale] ?? locale;

   const data = await tmdbFetch<TmdbPersonDetail>(
      `/person/${personId}`,
      {
         language,
         append_to_response: "images,videos,combined_credits,external_ids",
      },
      CacheConfig.DETAILS,
   );

   if (!data || ("status_code" in data && data.status_code === 34)) {
      return null;
   }

   let biography = data.biography;

   if (!biography || biography.trim() === "") {
      const fallbackDetails = await tmdbFetch<TmdbPersonDetail>(
         `/person/${personId}`,
         { language: "en-US" },
         CacheConfig.DETAILS,
      );

      const englishBiography = fallbackDetails?.biography ?? "";

      if (englishBiography) {
         biography = await translateText(
            englishBiography,
            TMDB_LANGUAGES[locale] ?? locale,
         );
      } else {
         biography = "";
      }
   }

   return { ...data, biography };
}
