"use client";

import { ReactNode, useMemo } from "react";
import { Link } from "@/app/i18n/navigation";
import { Skeleton } from "@/shared/ui/skeleton";
import { useLocale, useTranslations } from "next-intl";
import { GenresList } from "@/entities/media";
import { useImageLuminance } from "@/shared/lib/hooks/useImageLuminance";
import { formatDate } from "@/shared/lib/format/format-date";
import { TmdbImage } from "@/shared/ui/TmdbImage";
import { HeaderInfo } from "../../model/types";
import { FormattedRuntime } from "@/shared/ui/FormattedRuntime";
import { StarRating } from "@/shared/ui/StarRating";

interface MediaDetailsProps {
   id: number;
   mediaType: "movie" | "tv";
   children?: ReactNode;
   media: HeaderInfo;
   isLoading: boolean;
}

export function MediaHeader({
   id: mediaId,
   mediaType,
   children,
   media,
   isLoading,
}: MediaDetailsProps) {
   const t = useTranslations("media.headerInfo");
   const currentLocale = useLocale();
   console.log(media);

   const {
      title,
      tagline,
      logoPath,
      releaseDate,
      runtime,
      genreIds,
      rating,
      productionCountries,
      numberOfSeasons,
   } = media || {};

   const mediaHref = `/${mediaType === "tv" ? "tvshow" : mediaType}/${mediaId}`;
   const date = useMemo(
      () => formatDate(releaseDate, "yearOnly", currentLocale),
      [releaseDate, currentLocale],
   );

   const isDarkLogo = useImageLuminance(
      logoPath ? `https://image.tmdb.org/t/p/w200${logoPath}` : null,
   );

   return (
      <div className="space-y-3 sm:space-y-5 w-full sm:max-w-2xl">
         {isLoading ? (
            <div className="animate-[fadeInUp_0.8s_ease-out]">
               <Skeleton className="h-12 w-64 sm:h-16 sm:w-80 md:h-20 md:w-100 mb-4 sm:mb-8 lg:mb-10" />
               <div className="space-y-2 max-w-xl">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-2/4" />
               </div>
               <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                  <Skeleton className="h-4 w-8" />
                  <span className="text-white/20">|</span>
                  <Skeleton className="h-4 w-11" />
                  <span className="text-white/20">|</span>
                  <Skeleton className="h-4 w-14" />
                  <span className="text-white/20">|</span>
                  <Skeleton className="h-4 w-14" />
               </div>
               <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                  <Skeleton className="h-7 w-1/5" />
                  <Skeleton className="h-6 w-1/3" />
               </div>
            </div>
         ) : (
            <div
               key={mediaId}
               className="space-y-3 sm:space-y-5 animate-[fadeInUp_0.8s_ease-out] will-change-transform"
            >
               {logoPath ? (
                  <div className="mb-3 sm:mb-6 lg:mb-8">
                     <Link
                        href={mediaHref}
                        className="block group transition-transform duration-500 w-fit"
                     >
                        <TmdbImage
                           src={logoPath}
                           alt={title || "Media title"}
                           width={280}
                           height={240}
                           fadeDuration={300}
                           className={`${isDarkLogo ? "brightness-200 invert" : ""} origin-bottom-left select-none object-contain drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] h-auto w-40 md:w-80`}
                        />
                     </Link>
                  </div>
               ) : (
                  <div className="max-w-70 sm:max-w-150">
                     <Link
                        href={mediaHref}
                        className="group inline hover:opacity-90 transition-opacity"
                     >
                        <h1 className="inline text-3xl sm:text-5xl bg-linear-to-r from-zinc-100 via-zinc-400 to-zinc-600 bg-clip-text animate-shimmer font-bold text-white leading-tight">
                           {title}
                        </h1>
                     </Link>
                  </div>
               )}

               {/* media info */}
               <div className="flex flex-col gap-2 text-white/50">
                  {tagline && (
                     <p className="text-sm font-sans italic sm:text-base md:text-lg leading-relaxed text-zinc-300 drop-shadow-lg line-clamp-3 sm:line-clamp-4 max-w-xl">
                        {tagline}
                     </p>
                  )}

                  {genreIds && genreIds.length > 0 && (
                     <GenresList genreIds={genreIds} />
                  )}

                  <div className="flex items-center flex-wrap tracking-tighter gap-2 font-medium drop-shadow-md text-sm cursor-default">
                     {Number(rating) > 0 && (
                        <>
                           <StarRating text={`${Number(rating).toFixed(1)}`} />
                           <span className="text-white/20">|</span>
                        </>
                     )}

                     {releaseDate && <span>{date}</span>}

                     {mediaType === "movie" && runtime ? (
                        <>
                           <span className="text-white/20">|</span>
                           <FormattedRuntime runtime={runtime} />
                        </>
                     ) : null}

                     {mediaType === "tv" && numberOfSeasons ? (
                        <>
                           <span className="text-white/20">|</span>
                           <span>
                              {t("season", {
                                 count: numberOfSeasons,
                              })}
                           </span>
                        </>
                     ) : null}

                     {productionCountries && productionCountries.length > 0 && (
                        <>
                           <span className="text-white/20">|</span>
                           <span>
                              {productionCountries
                                 .map((c) => c.iso_3166_1)
                                 .join(", ")}
                           </span>
                        </>
                     )}
                  </div>

                  {children}
               </div>
            </div>
         )}
      </div>
   );
}
