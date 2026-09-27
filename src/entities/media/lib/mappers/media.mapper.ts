import { BaseMedia, HeaderInfo } from "../../model/types";
import { TMDBMedia } from "@/shared/types/tmdb-types";

export function mapToBaseMedia(item: TMDBMedia): BaseMedia {
   const isMovie = item.media_type === "movie";

   return {
      id: item.id,
      mediaType: item.media_type,
      title: (isMovie ? item.title : item.name) ?? "No title",
      backdropPath: item.backdrop_path,
      posterPath: item.poster_path,
      rating: item.vote_average,
      genreIds: item.genre_ids,
      overview: item.overview,
      releaseDate: isMovie ? item.release_date : item.first_air_date,
   };
}

export function mapToHeaderInfo(media: TMDBMedia): HeaderInfo {
   const baseMedia = mapToBaseMedia(media);
   const runtime =
      media.media_type === "movie"
         ? media.runtime || 0
         : media.episode_run_time?.[0] ||
           media.last_episode_to_air?.runtime ||
           0;

   const logoPath = media.images.logos?.[0]?.file_path || null;
   const numberOfSeasons =
      media.media_type === "tv" ? media?.number_of_seasons || 0 : 0;

   const genres = media.genres.map((item) => item.id);

   return {
      ...baseMedia,
      tagline: media.tagline || "",
      runtime,
      logoPath,
      genreIds: genres,
      productionCountries: media.production_countries || [],
      numberOfSeasons,
   };
}
