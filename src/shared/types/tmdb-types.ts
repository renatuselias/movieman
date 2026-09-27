interface TMDBImage {
   aspect_ratio: number;
   height: number;
   iso_639_1: string | null;
   file_path: string;
   vote_average: number;
   vote_count: number;
   width: number;
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
