/**
 * --- PEOPLE & CREDITS & CREW ---
 */

import { TMDBExternalIds, TMDBImage } from "@/shared/types/media-types";

interface TmdbBaseCredit {
   id: number;
   title?: string;
   name?: string;
   media_type: "movie" | "tv";
   poster_path: string | null;
   backdrop_path: string | null;
   release_date?: string;
   first_air_date?: string;
   vote_average: number;
   popularity: number;
   vote_count: number;
   weighted_score: number;
   overview: string;
   genre_ids: number[];
   order?: number;
}

export interface TmdbPersonCastCredit extends TmdbBaseCredit {
   character: string;
}

export interface TmdbPersonCrewCredit extends TmdbBaseCredit {
   job: string;
   department: string;
}

export type PersonCredit = TmdbPersonCastCredit | TmdbPersonCrewCredit;

export interface TmdbPersonDetail {
   id: number;
   name: string;
   biography: string;
   birthday: string | null;
   deathday: string | null;
   gender: number; // 0: Not set, 1: Female, 2: Male, 3: Non-binary
   known_for_department: string;
   place_of_birth: string | null;
   profile_path: string | null;
   popularity: number;
   imdb_id: string;
   homepage: string | null;
   also_known_as: string[];
   combined_credits?: {
      cast: TmdbPersonCastCredit[];
      crew: TmdbPersonCrewCredit[];
   };
   external_ids?: TMDBExternalIds;
   images?: { profiles: TMDBImage[] };
}
