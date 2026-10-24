"use server";

import { TMDB_LANGUAGES } from "@/shared/config/tmdb-languages";
import { getLocale } from "next-intl/server";
import { TmdbPersonDetail } from "../model/types";
import { tmdbFetch } from "@/shared/api/tmdb-api";

export async function getPersonDetail(
   personId: number | string,
): Promise<TmdbPersonDetail | null> {
   const locale = await getLocale();

   const language = TMDB_LANGUAGES[locale] ?? locale;

   const data = await tmdbFetch<TmdbPersonDetail>(
      `/person/${personId}`,
      {
         language,
         append_to_response: "combined_credits,external_ids",
      },
      86400,
   );

   return data;
}
