"use server";

import { tmdbFetch } from "@/shared/api/tmdb-api";
import { translateText } from "@/shared/api/translate-api";
import { CacheConfig } from "@/shared/config/cache";
import { TMDB_LANGUAGES } from "@/shared/config/tmdb-languages";
import {
   CollectionPerson,
   ExtendedCollection,
   TMDBCollection,
} from "@/shared/types/collection-types";
import { TMDBCrewMember, TMDBMovieCredits } from "@/shared/types/credits-types";
import { TMDBMovieListItem } from "@/shared/types/media-types";

export async function getCollection(
   collectionId: number | string,
   locale: string = "en-US",
): Promise<ExtendedCollection | null> {
   const language = TMDB_LANGUAGES[locale] ?? locale;

   const collection = await tmdbFetch<TMDBCollection>(
      `/collection/${collectionId}`,
      {
         language,
         append_to_response: "images",
         include_image_language: `${locale},null`,
      },
      CacheConfig.DETAILS,
   );

   if (!collection) {
      return null;
   }

   if (!collection.parts || collection.parts.length === 0) {
      return {
         ...collection,
         totalBudget: 0,
         totalRevenue: 0,
         cast: [],
         creators: [],
         averageRating: 0,
      };
   }

   const moviePromises = collection.parts.map(async (movie) => {
      try {
         const [credits, details] = await Promise.all([
            tmdbFetch<TMDBMovieCredits>(
               `/movie/${movie.id}/credits`,
               { language },
               CacheConfig.DETAILS,
            ),
            tmdbFetch<TMDBMovieListItem>(
               `/movie/${movie.id}`,
               { language },
               CacheConfig.DETAILS,
            ),
         ]);
         return { credits, details };
      } catch {
         return null;
      }
   });

   const moviesData = await Promise.all(moviePromises);

   let totalBudget = 0;
   let totalRevenue = 0;

   const castMap = new Map<number, CollectionPerson>();
   const creatorsMap = new Map<number, CollectionPerson>();

   for (const data of moviesData) {
      if (!data) continue;
      const { credits, details } = data;

      if (details?.budget) totalBudget += details.budget;
      if (details?.revenue) totalRevenue += details.revenue;

      const topCast = credits?.cast?.slice(0, 10) || [];
      for (const actor of topCast) {
         if (castMap.has(actor.id)) {
            const existing = castMap.get(actor.id)!;
            existing.appearanceCount += 1;
         } else {
            castMap.set(actor.id, {
               id: actor.id,
               name: actor.name,
               profile_path: actor.profile_path,
               character: actor.character,
               appearanceCount: 1,
            });
         }
      }

      const crew = credits?.crew || [];
      const directors = crew.filter(
         (person: TMDBCrewMember) =>
            person.job === "Director" ||
            person.job === "Writer" ||
            person.job === "Producer" ||
            person.job === "Screenplay",
      );

      for (const director of directors) {
         if (creatorsMap.has(director.id)) {
            const existing = creatorsMap.get(director.id)!;
            existing.appearanceCount += 1;
         } else {
            creatorsMap.set(director.id, {
               id: director.id,
               name: director.name,
               profile_path: director.profile_path,
               job: director.job,
               appearanceCount: 1,
            });
         }
      }
   }

   const cast = Array.from(castMap.values()).sort(
      (a, b) => b.appearanceCount - a.appearanceCount,
   );
   const creators = Array.from(creatorsMap.values()).sort(
      (a, b) => b.appearanceCount - a.appearanceCount,
   );

   const validMovies = moviesData.filter(
      (
         item,
      ): item is { credits: TMDBMovieCredits; details: TMDBMovieListItem } => {
         return (
            item !== null &&
            item.details !== null &&
            typeof item.details.vote_average === "number" &&
            item.details.vote_average > 0
         );
      },
   );

   const totalRating = validMovies.reduce(
      (sum, item) => sum + item.details.vote_average,
      0,
   );

   const averageRating =
      validMovies.length > 0 ? totalRating / validMovies.length : 0;

   let finalOverview = collection.overview;

   if (!finalOverview || finalOverview.trim() === "") {
      const fallbackDetails = await tmdbFetch<TMDBCollection>(
         `/collection/${collectionId}`,
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

   return {
      ...collection,
      overview: finalOverview,
      totalBudget,
      totalRevenue,
      cast,
      averageRating,
      creators,
   };
}
