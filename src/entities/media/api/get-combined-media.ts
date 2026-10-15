"use server";

import { FetchMediaParams } from "@/shared/types/media-types";
import { BaseMedia, MediaDetails } from "../model/types";
import { getMedias } from "./get-medias";

export async function getCombinedMedia(
   params: FetchMediaParams,
): Promise<BaseMedia[] | MediaDetails[]> {
   try {
      const { sortBy = "popularity.desc", limit } = params;

      const [movies, tvShows] = await Promise.all([
         getMedias({ ...params, mediaType: "movie" }),
         getMedias({ ...params, mediaType: "tv" }),
      ]);

      let combined = [...movies, ...tvShows];

      if (sortBy.includes("vote_average")) {
         combined.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      } else {
         combined.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
      }

      if (limit) {
         combined = combined.slice(0, limit);
      }

      return combined;
   } catch (error) {
      console.error("Failed to fetch all media:", error);
      return [];
   }
}
