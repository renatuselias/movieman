"use server";

import { tmdbFetch } from "@/shared/api/tmdb-api";
import { CacheConfig } from "@/shared/config/cache";
import { mapToBaseMedia } from "../lib/mappers/media.mapper";
import { TMDBMedia } from "@/shared/types/media-types";
import { MediaType } from "../model/types";

interface GetTrendingOptions {
   timeWindow?: "day" | "week";
   locale: string;
   limit?: number; // Optional limit for returned items
   mediaType: MediaType;
}

export async function getTrendingMedia({
   timeWindow = "day",
   locale = "en-US",
   limit = 8,
   mediaType = "all",
}: GetTrendingOptions) {
   const data = await tmdbFetch<{ results: TMDBMedia[] }>(
      `/trending/${mediaType}/${timeWindow}`,
      { language: locale },
      CacheConfig.LISTS,
   );

   if (!data?.results || data.results.length === 0) {
      return [];
   }

   let filtered = data.results.filter(
      (item) => item.media_type === "movie" || item.media_type === "tv",
   );

   if (limit && limit > 0) {
      filtered = filtered.slice(0, limit);
   }

   const results = filtered
      .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
      .map(mapToBaseMedia);

   return results;
}
