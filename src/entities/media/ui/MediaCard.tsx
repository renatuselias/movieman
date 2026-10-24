import { TmdbImage } from "@/shared/ui/TmdbImage";
import { GenresList } from "./GenresList";
import { StarRating } from "@/shared/ui/StarRating";
import { Skeleton } from "@/shared/ui/skeleton";
import { formatDate, getReleaseLabel } from "@/shared/lib/format/format-date";
import { useLocale, useTranslations } from "next-intl";
import { MediaType, TmdbSize } from "@/shared/types/media-types";

export function MediaCard({
   genreIds,
   overview,
   rating,
   title,
   mediaType,
   posterPath,
   releaseDate,
   tmdbSize,
   onClick,
}: {
   genreIds: number[];
   overview: string;
   rating: number;
   title: string;
   mediaType: MediaType;
   posterPath: string | null;
   releaseDate: string;
   tmdbSize: TmdbSize;
   onClick: () => void;
}) {
   const t = useTranslations("");
   const currentLocale = useLocale();

   return (
      <div className="group flex flex-col gap-2">
         <div
            onClick={onClick}
            className=" relative aspect-2/3 w-full overflow-hidden bg-zinc-950 cursor-pointer transform transition-all duration-500"
         >
            <Skeleton className="absolute inset-0 h-full w-full rounded-none! border border-zinc-700/30 z-0" />
            <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-transparent to-transparent opacity-80" />

            <TmdbImage
               src={posterPath}
               alt={title || "Poster"}
               fill
               tmdbSize={tmdbSize}
            />
            <div className="px-5 absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-center z-20">
               <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out flex flex-col gap-2">
                  {releaseDate && (
                     <div>
                        <h4>
                           {t(
                              `media.mediaDetails.${getReleaseLabel(releaseDate, mediaType)}`,
                           )}
                        </h4>
                        <p className="text-xs">{`${formatDate(releaseDate, "full", currentLocale)}`}</p>
                     </div>
                  )}
                  {overview && (
                     <div>
                        <h4>{t("media.mediaDetails.synopsis")}</h4>
                        <p className="line-clamp-5 text-xs leading-relaxed text-zinc-300/90 font-normal">
                           {overview}
                        </p>
                     </div>
                  )}
               </div>
            </div>
         </div>
         <div>
            <div className="flex gap-2 flex-wrap justify-between items-center">
               <span className="text-zinc-500 text-xs">
                  {[
                     mediaType && t(`media.${mediaType}`),
                     releaseDate &&
                        formatDate(releaseDate, "yearOnly", currentLocale),
                  ]
                     .filter(Boolean)
                     .join(" / ")}
               </span>
               <StarRating rating={Number(rating.toFixed(1))} />
            </div>
            <button
               type="button"
               onClick={onClick}
               className="max-w-full truncate text-zinc-300 font-medium hover:text-zinc-100 cursor-pointer"
            >
               {title}
            </button>

            <div className="w-full hidden sm:block">
               <GenresList
                  genreIds={genreIds}
                  isCard={true}
               />
            </div>
         </div>
      </div>
   );
}
