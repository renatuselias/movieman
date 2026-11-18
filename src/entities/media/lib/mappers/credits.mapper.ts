import { TMDBMediaCast, TMDBMediaCrew } from "@/shared/types/credits-types";
import { getMainCreators } from "../getMainCreators";
import { TMDBMedia } from "@/shared/types/media-types";
import { BaseCreditMember, CastMember, CrewMember } from "../../model/types";
import { CollectionPerson } from "@/shared/types/collection-types";

export function mapToBaseCast(
   cast: TMDBMediaCast[] | CollectionPerson[],
): CastMember[] {
   const mappedCast = cast.map((member) => {
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

   return mappedCast;
}

export function mapToBaseCrew(crew: TMDBMediaCrew[]): CrewMember[] {
   const mappedCrew = crew.map((member) => {
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

   return mappedCrew;
}

export function mapToCreators(
   crew: TMDBMediaCrew[],
   media: TMDBMedia,
): BaseCreditMember[] {
   const mappedCrew = mapToBaseCrew(crew);
   const creators = getMainCreators(mappedCrew);
   if (media.media_type === "movie") {
      return creators;
   } else {
      return media.created_by.map((item) => ({
         id: item.id,
         name: item.name,
         profilePath: item.profile_path,
      }));
   }
}
