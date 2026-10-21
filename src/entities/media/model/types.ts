import {
   MediaStatus,
   MediaType,
   TMDB_episode_to_air,
   TMDBNetwork,
   TMDBProductionCompany,
   TMDBProductionCountry,
   TMDBVideo,
   TvType,
} from "@/shared/types/media-types";

export interface BaseMedia {
   id: number;
   mediaType: MediaType;
   title: string;
   backdropPath: string | null;
   posterPath: string | null;
   rating: number;
   genreIds: number[];
   overview: string;
   releaseDate: string;
   popularity?: number;
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

export interface CrewMember extends BaseCreditMember {
   job: string;
}

export interface MediaDetails extends BaseMedia {
   tagline: string;
   logoPath: string | null;
   runtime: number;
   productionCountries: TMDBProductionCountry[];
   productionCompanies: TMDBProductionCompany[];
   originalTitle: string;
   numberOfSeasons: number;
   numberOfEpisodes: number;
   lastEpisode: TMDB_episode_to_air | null;
   nextEpisode: TMDB_episode_to_air | null;
   homePage: string;
   networks: TMDBNetwork[] | null;
   budget: number;
   revenue: number;
   cast: CastMember[];
   crew: CrewMember[];
   status: MediaStatus;
   createdBy:
      | {
           id: number;
           name: string;
           profilePath: string | null;
        }[]
      | null;
   type: TvType | null;
}

export interface MediaFullInfo extends MediaDetails {
   videos: TMDBVideo[];
   recommendations: BaseMedia[];
}
