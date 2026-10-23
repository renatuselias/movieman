import { BaseCreditMember, CrewMember } from "../model/types";

const JOB_PRIORITIES: Record<string, number> = {
   Director: 1,
   Screenplay: 2,
   Writer: 3,
};

export const getMainCreators = (
   crew: CrewMember[] = [],
): BaseCreditMember[] => {
   return crew.reduce<{ priority: number; members: CrewMember[] }>(
      (acc, currentMember) => {
         const currentPriority = JOB_PRIORITIES[currentMember.job];

         if (!currentPriority) return acc;

         if (currentPriority < acc.priority) {
            return {
               priority: currentPriority,
               members: [currentMember],
            };
         }

         if (currentPriority === acc.priority) {
            acc.members.push(currentMember);
         }

         return acc;
      },
      { priority: Infinity, members: [] },
   ).members;
};
