"use server";

import { tmdbFetch } from "@/shared/api/tmdb-api";
import { TMDB_LANGUAGES } from "@/shared/config/tmdb-languages";
import { CacheConfig } from "@/shared/config/cache";
import { getLocale } from "next-intl/server";
import {
   FetchMediaParams,
   TMDBMedia,
   TMDBPaginatedResponse,
} from "@/shared/types/media-types";
import { BaseMedia } from "../model/types";
import { mapToBaseMedia } from "../lib/mappers/media.mapper";
import { getCombinedMedia } from "./get-combined-media";

export async function getMedias(
   params: FetchMediaParams,
): Promise<BaseMedia[]> {
   const {
      endpoint,
      mediaType = "movie",
      providerId,
      genreId,
      voteCountGte,
      withoutGenres,
      sortBy = "popularity.desc",
      region = "US",
      page = 1,
      withOriginalLanguage,
      withOriginCountry,
      limit,
      releaseDateGte,
      releaseDateLte,
   } = params;

   if (mediaType === "all") {
      return getCombinedMedia(params);
   }

   try {
      const locale = await getLocale();
      const lang = TMDB_LANGUAGES[locale] ?? locale;
      const targetEndpoint = endpoint ?? `/discover/${mediaType}`;

      const queryParams: Record<string, string | number | undefined> = {
         language: lang,
         page,
      };

      if (!endpoint) {
         queryParams.with_watch_providers = providerId;
         queryParams.watch_region = region;
         queryParams.with_genres = genreId;
         queryParams["vote_count.gte"] = voteCountGte;
         queryParams.sort_by = sortBy;

         if (withoutGenres) queryParams.without_genres = withoutGenres;
         if (withOriginCountry)
            queryParams.with_origin_country = withOriginCountry;
         if (withOriginalLanguage)
            queryParams.with_original_language = withOriginalLanguage;

         const releaseGteKey =
            mediaType === "tv"
               ? "first_air_date.gte"
               : "primary_release_date.gte";
         const releaseLteKey =
            mediaType === "tv"
               ? "first_air_date.lte"
               : "primary_release_date.lte";

         if (releaseDateGte) queryParams[releaseGteKey] = releaseDateGte;
         if (releaseDateLte) queryParams[releaseLteKey] = releaseDateLte;
      }

      const data = await tmdbFetch<TMDBPaginatedResponse<TMDBMedia>>(
         targetEndpoint,
         queryParams,
         CacheConfig.LISTS,
      );

      if (!data?.results || data.results.length === 0) {
         return [];
      }

      let rawList: TMDBMedia[] = data.results;

      rawList = rawList.filter((item) => {
         const hasBackdrop = Boolean(item.backdrop_path);

         if (endpoint === "/tv/on_the_air") {
            return hasBackdrop && (item.vote_average ?? 0) >= 7.0;
         }
         return hasBackdrop;
      });

      if (limit) rawList = rawList.slice(0, limit);

      rawList = rawList.map((item) => ({
         ...item,
         media_type: mediaType,
      })) as TMDBMedia[];

      if (sortBy !== "popularity.desc") {
         return rawList.map(mapToBaseMedia);
      }

      return rawList
         .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
         .map(mapToBaseMedia);
   } catch (error) {
      console.error(`Failed to fetch ${mediaType}:`, error);
      return [];
   }
}
