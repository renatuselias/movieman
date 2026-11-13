import { mapToBaseMedia } from "@/entities/media";
import { TmdbPersonCastCredit, TmdbPersonCrewCredit } from "../model/types";

export function combinePersonCredits(
   cast: Array<TmdbPersonCastCredit>,
   crew: Array<TmdbPersonCrewCredit>,
): ReturnType<typeof mapToBaseMedia>[] {
   const creditsByMedia = new Map<string, ReturnType<typeof mapToBaseMedia>>();

   [...cast, ...crew]
      .filter(
         (item) =>
            (item.release_date || item.first_air_date) && item.poster_path,
      )
      .map((item) => mapToBaseMedia(item))
      .forEach((credit) => {
         const key = `${credit.mediaType}:${credit.id}`;
         const existing = creditsByMedia.get(key);

         if (!existing) {
            creditsByMedia.set(key, credit);
            return;
         }

         const mergeValues = (first?: string | null, second?: string | null) =>
            [
               ...new Set(
                  [first, second].filter((value): value is string =>
                     Boolean(value),
                  ),
               ),
            ].join(", ") || null;

         creditsByMedia.set(key, {
            ...existing,
            character: mergeValues(existing.character, credit.character),
            job: mergeValues(existing.job, credit.job),
         });
      });

   return [...creditsByMedia.values()];
}
