"use server";

import { TMDB_LANGUAGES } from "@/shared/config/tmdb-languages";
import { TmdbPersonDetail } from "../model/types";
import { tmdbFetch } from "@/shared/api/tmdb-api";
import { Locale } from "next-intl";

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
      86400,
   );

   return data;
}
