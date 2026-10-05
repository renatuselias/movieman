import { TMDBMediaCast, TMDBMediaCrew } from "./credits-types";

interface TMDBImage {
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

interface TMDBLast_episode_to_air {
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
   tagline: string;
   videos: { results: TMDBVideo[] };
   cast: TMDBMediaCast[];
   crew: TMDBMediaCrew[];
}

interface TMDBMovieListItem extends TMDBBaseMedia {
   media_type: "movie";
   title: string;
   original_title: string;
   release_date: string;
   runtime: number;
   video: boolean;
}

interface TMDBTVShowListItem extends TMDBBaseMedia {
   media_type: "tv";
   name: string;
   original_name: string;
   first_air_date: string;
   origin_country: string[];
   episode_run_time: number[];
   last_episode_to_air: TMDBLast_episode_to_air;
   number_of_seasons: number;
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

// RECOMMENDATIONS

export interface TMDBPaginatedResponse<T> {
   page: number;
   results: T[];
   total_pages: number;
   total_results: number;
}

export type TMDBMovieRecommendations = TMDBPaginatedResponse<TMDBMovieListItem>;

export type TMDBTVRecommendations = TMDBPaginatedResponse<TMDBTVShowListItem>;

export type TMDBRecommendations =
   | TMDBMovieRecommendations
   | TMDBTVRecommendations;
