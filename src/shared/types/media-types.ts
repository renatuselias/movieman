import { TMDBMediaCast, TMDBMediaCrew } from "./credits-types";

export type MediaType = "movie" | "tv";
export type MediaTypeWithAll = MediaType | "all";

export interface TMDBExternalIds {
   imdb_id: string | null;
   wikidata_id: string | null;
   facebook_id: string | null;
   instagram_id: string | null;
   twitter_id: string | null;
   tiktok_id: string | null;
   youtube_id: string | null;
}

export interface TMDBImage {
   aspect_ratio: number;
   height: number;
   iso_639_1: string | null;
   file_path: string;
   vote_average: number;
   vote_count: number;
   width: number;
}

export interface TMDBVideo {
   id: string;
   iso_639_1: string;
   iso_3166_1: string;
   key: string;
   name: string;
   site: string;
   size: number;
   type:
      | "Trailer"
      | "Teaser"
      | "Clip"
      | "Featurette"
      | "Behind the Scenes"
      | "Bloopers";
   official: boolean;
   published_at: string;
}

export interface TMDB_episode_to_air {
   air_date: string;
   episode_number: number;
   episode_type: string;
   id: number;
   name: string;
   overview: string;
   production_code: string;
   runtime: number;
   season_number: number;
   show_id: number;
   still_path: string;
   vote_average: number;
   vote_count: number;
}

export interface TMDBProductionCountry {
   iso_3166_1: string;
   name: string;
}

export interface TMDBProductionCompany {
   id: number;
   name: string;
   logo_path: string | null;
   origin_country: string;
}

export interface TMDBNetwork {
   id: number;
   logo_path: string;
   name: string;
   origin_country: string;
}

export interface TMDBMediaCollection {
   id: number;
   name: string;
   poster_path: string | null;
   backdrop_path: string | null;
}

type MovieStatus =
   | "Rumored"
   | "Planned"
   | "In Production"
   | "Post Production"
   | "Released"
   | "Canceled";

type TvStatus =
   | "In Production"
   | "Returning Series"
   | "Ended"
   | "Canceled"
   | "Pilot";

export type MediaStatus = MovieStatus | TvStatus;

export type TvType =
   | "Scripted"
   | "Unscripted"
   | "Miniseries"
   | "Documentary"
   | "Reality"
   | "Talk Show"
   | "News"
   | "Video";

interface TMDBBaseMedia {
   id: number;
   adult: boolean;
   backdrop_path: string | null;
   poster_path: string | null;
   genre_ids: number[];
   genres: { id: number; name: string }[];
   original_language: string;
   overview: string;
   popularity: number;
   vote_average: number;
   vote_count: number;
   images: { logos: TMDBImage[]; backdrops: TMDBImage[]; posters: TMDBImage[] };
   production_countries: TMDBProductionCountry[];
   production_companies: TMDBProductionCompany[];
   tagline: string;
   videos: { results: TMDBVideo[] };
   cast: TMDBMediaCast[];
   crew: TMDBMediaCrew[];
   homepage: string;
   recommendations: { results: TMDBMedia[] };
   status: MediaStatus;
   belongs_to_collection: TMDBMediaCollection;
   external_ids: TMDBExternalIds;
}

interface TMDBMovieListItem extends TMDBBaseMedia {
   media_type: "movie";
   title: string;
   original_title: string;
   release_date: string;
   runtime: number;
   budget: number;
   revenue: number;
   video: boolean;
}

interface TMDBTVShowListItem extends TMDBBaseMedia {
   media_type: "tv";
   name: string;
   original_name: string;
   first_air_date: string;
   origin_country: string[];
   episode_run_time: number[];
   last_episode_to_air: TMDB_episode_to_air;
   next_episode_to_air: TMDB_episode_to_air;
   number_of_seasons: number;
   number_of_episodes: number;
   networks: TMDBNetwork[];
   type: TvType;
   created_by: {
      id: number;
      name: string;
      profile_path: string | null;
   }[];
}

export type TMDBMedia = TMDBMovieListItem | TMDBTVShowListItem;

export type TmdbSize =
   | "w92"
   | "w154"
   | "w185"
   | "w200"
   | "w300"
   | "w500"
   | "w780"
   | "w1280"
   | "original";

// Fetch interfaces

export interface TMDBPaginatedResponse<T> {
   page: number;
   results: T[];
   total_pages: number;
   total_results: number;
}

export interface FetchMediaParams {
   endpoint?: string;
   mediaType?: MediaTypeWithAll;
   providerId?: number;
   genreId?: number;
   voteCountGte?: number;
   withOriginalLanguage?: string;
   withOriginCountry?: string;
   withoutGenres?: string | number; // e.g. 16 or "16,10762"
   releaseDateGte?: string;
   releaseDateLte?: string;
   sortBy?:
      | "popularity.desc"
      | "vote_average.desc"
      | "primary_release_date.desc"
      | "revenue.desc";
   region?: string;
   page?: number;
   limit?: number;
   isCarousel?: boolean;
}

type EndpointParams = {
   endpoint: string;
   genreId?: never;
   providerId?: never;
   sortBy?: never;
   region?: never;
   page?: never;
};

type DiscoverParams = {
   endpoint?: never;
   genreId?: number;
   providerId?: number;
   sortBy?: FetchMediaParams["sortBy"];
   region?: string;
   voteCountGte?: number;
   page?: number;
   releaseDateGte?: string;
   releaseDateLte?: string;
   withOriginalLanguage?: string;
   withOriginCountry?: string;
   withoutGenres?: string | number; // e.g. 16 or "16,10762"
};

export type MediaParams = EndpointParams | DiscoverParams;

// RECOMMENDATIONS

export type TMDBMovieRecommendations = TMDBPaginatedResponse<TMDBMovieListItem>;

export type TMDBTVRecommendations = TMDBPaginatedResponse<TMDBTVShowListItem>;

export type TMDBRecommendations =
   | TMDBMovieRecommendations
   | TMDBTVRecommendations;
