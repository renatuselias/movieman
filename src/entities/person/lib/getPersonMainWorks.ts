import { PersonCredit, TmdbPersonDetail } from "../model/types";

export const getPersonMainWorks = (
   personDetails: TmdbPersonDetail | null | undefined,
) => {
   const department = personDetails?.known_for_department;
   const credits = personDetails?.combined_credits;

   if (!credits) return [];

   let rawList: PersonCredit[] = [];

   if (department === "Acting") {
      rawList = credits.cast || [];
   } else {
      rawList = (credits.crew || []).filter(
         (item) => item.department === department,
      );
   }

   return getBestWorks(rawList);
};

const getBestWorks = <T extends PersonCredit>(
   credits: T[] = [],
   minVotes = 300,
   globalMean = 6.5,
) => {
   return [...credits]
      .map((item) => {
         const v = item.vote_count ?? 0;
         const R = item.vote_average ?? 0;
         const m = minVotes;
         const C = globalMean;

         const hasOrder = "order" in item && typeof item.order === "number";
         const orderVal = hasOrder
            ? (item.order as number)
            : item.media_type === "tv"
              ? 4
              : 0;
         const O = 1 / (1 + Math.pow(orderVal, 0.7) * 0.2);

         const bayesianScore = (v / (v + m)) * R + (m / (v + m)) * C;

         const volumeFactor = Math.log10(v + 10);

         const epCount =
            "episode_count" in item && typeof item.episode_count === "number"
               ? item.episode_count
               : 0;
         let tvFactor = 1.0;

         if (item.media_type === "tv") {
            if (epCount > 0 && epCount < 5) {
               tvFactor = 0.1;
            } else if (epCount >= 17) {
               tvFactor = 2.2;
            }
         }

         const score = bayesianScore * O * volumeFactor * tvFactor;

         return { ...item, weighted_score: score };
      })
      .sort((a, b) => b.weighted_score - a.weighted_score);
};
