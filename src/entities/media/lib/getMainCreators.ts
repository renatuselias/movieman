import { BaseCreditMember, CrewMember } from "../model/types";

const JOB_PRIORITIES: Record<string, number> = {
   Director: 1,
   Screenplay: 2,
   Writer: 3,
   Producer: 4,
};

export const getMainCreators = (
   crew: CrewMember[] = [],
): BaseCreditMember[] => {
   const seenIds = new Set<number>();

   return crew
      .filter((member) => Boolean(JOB_PRIORITIES[member.job]))
      .sort((a, b) => JOB_PRIORITIES[a.job] - JOB_PRIORITIES[b.job])
      .filter((member) => {
         if (seenIds.has(member.id)) return false;
         seenIds.add(member.id);
         return true;
      });
};
