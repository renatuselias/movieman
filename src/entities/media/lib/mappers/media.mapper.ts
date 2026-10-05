import { BaseMedia, HeaderInfo } from "../../model/types";
import { TMDBMedia } from "@/shared/types/media-types";
import { getMainCreators } from "../getMainCreators";

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
   const isMovieMedia = media.media_type === "movie";
   const runtime = isMovieMedia
      ? media.runtime || 0
      : media.episode_run_time?.[0] || media.last_episode_to_air?.runtime || 0;

   const logoPath = media.images.logos?.[0]?.file_path || null;
   const numberOfSeasons = isMovieMedia ? 0 : media.number_of_seasons || 0;

   const genres = media.genres.map((item) => item.id);

   const cast = media.cast.map((item) => {
      const character =
         "character" in item && typeof item.character === "string"
            ? item.character
            : "roles" in item
              ? item.roles
                   ?.map((role) => role.character)
                   .filter(Boolean)
                   .join(" / ") || "Unknown character"
              : "Unknown character";

      return {
         id: item.id,
         name: item.name,
         character,
         profilePath: item.profile_path,
         episodeCount:
            "total_episode_count" in item ? item.total_episode_count : 0,
      };
   });

   const crew = media.crew.map((item) => {
      const job =
         "job" in item && typeof item.job === "string"
            ? item.job
            : "jobs" in item
              ? item.jobs
                   ?.map((crewJob) => crewJob.job)
                   .filter(Boolean)
                   .join(" / ") || "Unknown job"
              : "Unknown job";

      return {
         id: item.id,
         name: item.name,
         profilePath: item.profile_path,
         job,
      };
   });

   const creator = getMainCreators(crew)[0];
   const createdBy = isMovieMedia
      ? creator
         ? {
              id: creator.id,
              name: creator.name,
              profilePath: creator.profilePath,
           }
         : null
      : media.created_by[0]
        ? {
             id: media.created_by[0].id,
             name: media.created_by[0].name,
             profilePath: media.created_by[0].profile_path,
          }
        : null;

   return {
      ...baseMedia,
      tagline: media.tagline || "",
      runtime,
      logoPath,
      genreIds: genres,
      productionCountries: media.production_countries || [],
      numberOfSeasons,
      cast,
      crew,
      createdBy,
   };
}
