import { BaseMedia, MediaDetails, MediaFullInfo } from "../../model/types";
import { TMDBMedia } from "@/shared/types/media-types";
import { getMainCreators } from "../getMainCreators";
import { PersonCredit } from "@/entities/person/model/types";
import { mapToBaseCast, mapToBaseCrew, mapToCreators } from "./credits.mapper";

export function mapToBaseMedia(media: TMDBMedia | PersonCredit): BaseMedia {
   const isMovie = media.media_type === "movie";
   const firstCreditAirDate =
      "first_credit_air_date" in media ? media.first_credit_air_date : null;
   return {
      id: media.id,
      mediaType: media.media_type,
      title: (isMovie ? media.title : media.name) ?? "No title",
      backdropPath: media.backdrop_path,
      posterPath: media.poster_path,
      rating: media.vote_average,
      genreIds: media.genre_ids,
      overview: media.overview,
      releaseDate:
         (isMovie
            ? media.release_date
            : firstCreditAirDate || media.first_air_date) || null,
      character: "character" in media ? media.character : null,
      job: "job" in media ? media.job : null,
      firstCreditAirDate,
      episodeCount: "episode_count" in media ? media.episode_count : null,
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

   return {
      ...baseMedia,
      tagline: media.tagline || "",
      runtime,
      logoPath,
      genreIds: genres,
      productionCountries: media.production_countries || [],
      numberOfSeasons,
      numberOfEpisodes: isMovieMedia ? 0 : media.number_of_episodes,
      lastEpisode: isMovieMedia ? null : media.last_episode_to_air,
      nextEpisode: isMovieMedia ? null : media.next_episode_to_air,
      cast: mapToBaseCast(media.cast),
      crew: mapToBaseCrew(media.crew),
      createdBy: mapToCreators(media.crew, media),
      homePage: media.homepage,
      originalTitle: isMovieMedia ? media.original_title : media.original_name,
      networks: isMovieMedia ? null : media.networks,
      productionCompanies: media.production_companies,
      budget: isMovieMedia ? media.budget : 0,
      revenue: isMovieMedia ? media.revenue : 0,
      status: media.status,
      type: isMovieMedia ? null : media.type,
      backdrops: media.images.backdrops.map((i) => i.file_path),
      posters: media.images.posters.map((i) => i.file_path),
      belongsToCollection: media.belongs_to_collection,
      externalIds: media.external_ids,
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
