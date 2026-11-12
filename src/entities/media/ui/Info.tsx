"use client";

import { Fragment } from "react";
import { StarRating } from "@/shared/ui/StarRating";
import { FormattedRuntime } from "@/shared/ui/FormattedRuntime";
import { MediaType, TMDBProductionCountry } from "@/shared/types/media-types";
import { DateComponent } from "@/shared/ui/DateComponent";
import { useTranslations } from "next-intl";

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
   const t = useTranslations("media.mediaDetails");

   const items = [
      Number(rating) > 0 && (
         <StarRating
            key="rating"
            rating={Number(Number(rating).toFixed(1))}
         />
      ),
      releaseDate && (
         <DateComponent
            key="date"
            releaseDate={releaseDate}
         />
      ),
      mediaType === "movie" && runtime > 0 && (
         <FormattedRuntime
            key="runtime"
            runtime={runtime}
         />
      ),
      mediaType === "tv" && numberOfSeasons > 0 && (
         <span key="seasons">{t("season", { count: numberOfSeasons })}</span>
      ),
      productionCountries && productionCountries.length > 0 && (
         <span
            key="countries"
            className="text-sm"
         >
            {productionCountries.map((c) => c.iso_3166_1).join(", ")}
         </span>
      ),
   ].filter(Boolean);

   if (items.length === 0) return null;

   return (
      <div className="text-muted-foreground my-1 flex items-center flex-wrap tracking-tighter gap-2 drop-shadow-md cursor-default">
         {items.map((item, index) => (
            <Fragment key={index}>
               {index > 0 && <span className="text-white/40">•</span>}
               {item}
            </Fragment>
         ))}
      </div>
   );
}
