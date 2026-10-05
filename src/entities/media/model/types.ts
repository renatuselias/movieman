import { TMDBProductionCountry } from "@/shared/types/media-types";

export interface BaseMedia {
   id: number;
   mediaType: "movie" | "tv";
   title: string;
   backdropPath: string | null;
   posterPath: string | null;
   rating: number;
   genreIds: number[];
   overview: string;
   releaseDate: string;
}

interface BaseCreditMember {
   id: number;
   name: string;
   profilePath: string | null;
}

interface CastMember extends BaseCreditMember {
   character: string;
   episodeCount: number;
}

interface CrewMember extends BaseCreditMember {
   job: string;
}

export interface HeaderInfo extends BaseMedia {
   tagline: string;
   logoPath: string | null;
   runtime: number;
   productionCountries: TMDBProductionCountry[];
   numberOfSeasons: number;
   cast: CastMember[];
   crew: CrewMember[];
   createdBy: {
      id: number;
      name: string;
      profilePath: string | null;
   } | null;
}
