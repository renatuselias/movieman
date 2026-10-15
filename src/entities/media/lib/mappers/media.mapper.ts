import { BaseMedia, MediaDetails, MediaFullInfo } from "../../model/types";
import { TMDBMedia } from "@/shared/types/media-types";
import { getMainCreators } from "../getMainCreators";

export function mapToBaseMedia(media: TMDBMedia): BaseMedia {
   const isMovie = media.media_type === "movie";

   return {
      id: media.id,
      mediaType: media.media_type,
      title: (isMovie ? media.title : media.name) ?? "No title",
      backdropPath: media.backdrop_path,
      posterPath: media.poster_path,
      rating: media.vote_average,
      genreIds: media.genre_ids,
      overview: media.overview,
      releaseDate: isMovie ? media.release_date : media.first_air_date,
   };
}

export function mapToMediaDetails(media: TMDBMedia): MediaDetails {
   const baseMedia = mapToBaseMedia(media);
   const isMovieMedia = media.media_type === "movie";
   const runtime = isMovieMedia
      ? media.runtime || 0
      : media.episode_run_time?.[0] || media.last_episode_to_air?.runtime || 0;

   const logoPath = media.images.logos?.[0]?.file_path || null;
   const numberOfSeasons = isMovieMedia ? 0 : media.number_of_seasons || 0;

   const genres = media.genres.map((genre) => genre.id);

   const cast = media.cast.map((member) => {
      const character =
         "character" in member && typeof member.character === "string"
            ? member.character
            : "roles" in member
              ? member.roles
                   ?.map((role) => role.character)
                   .filter(Boolean)
                   .join(" / ") || "Unknown character"
              : "Unknown character";

      return {
         id: member.id,
         name: member.name,
         character,
         profilePath: member.profile_path,
         episodeCount:
            "total_episode_count" in member ? member.total_episode_count : 0,
      };
   });

   const crew = media.crew.map((member) => {
      const job =
         "job" in member && typeof member.job === "string"
            ? member.job
            : "jobs" in member
              ? member.jobs
                   ?.map((crewJob) => crewJob.job)
                   .filter(Boolean)
                   .join(" / ") || "Unknown job"
              : "Unknown job";

      return {
         id: member.id,
         name: member.name,
         profilePath: member.profile_path,
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
      homePage: media.homepage,
   };
}

export function mapToFullMedia(media: TMDBMedia): MediaFullInfo {
   const mediaDetails = mapToMediaDetails(media);
   const recommendations = media.recommendations.results.map((item) =>
      mapToBaseMedia(item),
   );

   return {
      ...mediaDetails,
      videos: media.videos.results,
      recommendations,
   };
}
