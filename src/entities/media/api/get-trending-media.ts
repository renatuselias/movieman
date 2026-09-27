"use server";

import { tmdbFetch } from "@/shared/api/tmdb-api";
import { CacheConfig } from "@/shared/config/cache";
import { getLocale } from "next-intl/server";
import { mapToBaseMedia } from "../lib/mappers/media.mapper";
import { TMDBMedia } from "@/shared/types/tmdb-types";

export async function getTrendingMedia(timeWindow: "day" | "week" = "day") {
   const locale = await getLocale();

   const data = await tmdbFetch(
      `/trending/all/${timeWindow}`,
      { language: locale },
      CacheConfig.LISTS,
   );

   if (!data?.results || data.results.length === 0) {
      return { results: [] };
   }

   const results = data.results
      .filter(
         (item: TMDBMedia) =>
            item.media_type === "movie" || item.media_type === "tv",
      )
      .sort(
         (a: TMDBMedia, b: TMDBMedia) =>
            (b.popularity ?? 0) - (a.popularity ?? 0),
      )
      .map(mapToBaseMedia);

   return { results };
}
