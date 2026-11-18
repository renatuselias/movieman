import {
   BaseCreditMember,
   CrewMember,
   getMainCreators,
} from "@/entities/media";
import { CollectionPerson } from "../types/collection-types";

type CrewInput = CrewMember[] | CollectionPerson[];

function normalizeCrew(crew: CrewInput): CrewMember[] {
   const seenIds = new Set<number>();

   return crew.flatMap((member) => {
      if (seenIds.has(member.id)) return [];
      seenIds.add(member.id);

      const profilePath =
         "profilePath" in member ? member.profilePath : member.profile_path;

      return [{
         id: member.id,
         name: member.name,
         profilePath,
         job: "job" in member && typeof member.job === "string"
            ? member.job
            : "",
      }];
   });
}

function getFeaturedCrew(crew: CrewMember[]) {
   const targetJobs = [
      "Director",
      "Screenplay",
      "Producer",
      "Story",
      "Executive Producer",
      "Co-Producer",
      "Showrunner",
      "Teleplay",
      "Creator",
      "Writer",
      "Original Music Composer",
      "Music",
      "Director of Photography",
   ];

   return crew.filter((member) => targetJobs.includes(member.job));
}

export function getMediaCrew(
   crewType: "directors" | "writers" | "photography" | "musicComposer",
   crew?: CrewMember[] | CollectionPerson[],
   createdBy?: BaseCreditMember[],
): BaseCreditMember[] {
   const cleanCrew = normalizeCrew(crew || []);
   const mediaCrew = getFeaturedCrew(cleanCrew);

   switch (crewType) {
      case "directors": {
         if (createdBy && createdBy.length > 0) {
            return createdBy;
         }
         return getMainCreators(cleanCrew);
      }

      case "writers": {
         const writerJobs = [
            "Screenplay",
            "Writer",
            "Story",
            "Producer",
            "Executive Producer",
            "Co-Producer",
            "Showrunner",
            "Teleplay",
            "Creator",
         ];
         return mediaCrew.filter((member) => writerJobs.includes(member.job));
      }

      case "photography": {
         return mediaCrew.filter(
            (member) => member.job === "Director of Photography",
         );
      }

      case "musicComposer": {
         const musicJobs = ["Original Music Composer", "Music"];
         return mediaCrew.filter((member) => musicJobs.includes(member.job));
      }

      default:
         return [];
   }
}
