"use client";

import { useLocale, useTranslations } from "next-intl";
import { MediaType } from "../model/types";
import { useState } from "react";
import { formatDate } from "@/shared/lib/format/format-date";
import { StarRating } from "@/shared/ui/StarRating";
import { FormattedRuntime } from "@/shared/ui/FormattedRuntime";
import { TMDBProductionCountry } from "@/shared/types/media-types";

interface InfoProps {
   rating: number;
   releaseDate: string | null;
   mediaType: MediaType;
   runtime: number;
   numberOfSeasons: number;
   productionCountries: TMDBProductionCountry[] | null;
}

export function Info({
   rating,
   releaseDate,
   mediaType,
   runtime,
   numberOfSeasons,
   productionCountries,
}: InfoProps) {
   const t = useTranslations("media.headerInfo");
   const currentLocale = useLocale();

   const [dateFormat, setDateFormat] = useState<"yearOnly" | "full">(
      "yearOnly",
   );

   const release = (format: "yearOnly" | "full") =>
      releaseDate ? formatDate(releaseDate, format, currentLocale) : null;

   return (
      <div className="text-muted-foreground my-1 flex items-center flex-wrap tracking-tighter gap-2 drop-shadow-md cursor-default">
         {Number(rating) > 0 && (
            <>
               <StarRating text={Number(rating).toFixed(1)} />
               <span className="text-white/20">•</span>
            </>
         )}

         {releaseDate && (
            <>
               <span
                  onClick={() =>
                     setDateFormat((prev) =>
                        prev === "yearOnly" ? "full" : "yearOnly",
                     )
                  }
                  className="cursor-pointer hover:text-zinc-300"
               >
                  {release(dateFormat)}
               </span>
            </>
         )}

         {mediaType === "movie" && runtime ? (
            <>
               <span className="text-white/20">•</span>
               <FormattedRuntime runtime={runtime} />
            </>
         ) : null}

         {mediaType === "tv" && numberOfSeasons ? (
            <>
               <span className="text-white/20">•</span>
               <span>
                  {t("season", {
                     count: numberOfSeasons,
                  })}
               </span>
            </>
         ) : null}

         {productionCountries && productionCountries.length > 0 && (
            <>
               <span className="text-white/20">•</span>
               <span className="text-sm">
                  {productionCountries.map((c) => c.iso_3166_1).join(", ")}
               </span>
            </>
         )}
      </div>
   );
}
