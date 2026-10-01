"use client";

import { ReactNode } from "react";
import { Link } from "@/app/i18n/navigation";
import { Skeleton } from "@/shared/ui/skeleton";
import { useLocale, useTranslations } from "next-intl";
import { useImageLuminance } from "@/shared/lib/hooks/useImageLuminance";
import { formatDate } from "@/shared/lib/format/format-date";
import { HeaderInfo } from "../model/types";
import { FormattedRuntime } from "@/shared/ui/FormattedRuntime";
import { StarRating } from "@/shared/ui/StarRating";
import { MediaLogo } from "./MediaLogo";
import { GenresList } from "./GenresList";

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
   const releaseYear = releaseDate
      ? formatDate(releaseDate, "yearOnly", currentLocale)
      : null;

   const logoUrl = logoPath
      ? `https://image.tmdb.org/t/p/w200${logoPath}`
      : null;
   const isDarkLogo = useImageLuminance(logoUrl);

   return (
      <div className="space-y-3 sm:space-y-5 w-full sm:max-w-2xl">
         {isLoading ? (
            <div className="animate-[fadeInUp_0.8s_ease-out]">
               <Skeleton className="h-12 w-64 sm:h-16 sm:w-80 md:h-20 mb-4 sm:mb-8 lg:mb-10" />
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
            <div className="space-y-3 sm:space-y-5 animate-[fadeInUp_0.8s_ease-out] will-change-transform">
               {logoPath ? (
                  <Link
                     href={mediaHref}
                     className="block group transition-transform duration-500 w-fit"
                  >
                     <MediaLogo
                        logoPath={logoPath}
                        title={title}
                        isDarkLogo={isDarkLogo}
                     />
                  </Link>
               ) : (
                  <div className="max-w-70 sm:max-w-150">
                     <Link
                        href={mediaHref}
                        className="group inline hover:opacity-90 transition-opacity"
                     >
                        <h1 className="inline text-3xl sm:text-5xl bg-linear-to-r from-zinc-100 via-zinc-400 to-zinc-600 bg-clip-text font-bold text-transparent leading-tight">
                           {title}
                        </h1>
                     </Link>
                  </div>
               )}

               {/* Media info */}
               <div className="flex flex-col gap-1 text-muted-foreground w-full text-base">
                  {tagline && (
                     <div className="relative pl-2 border-l-2 border-red-700 my-1">
                        <p className="font-sans italic text-base leading-relaxed text-zinc-300 drop-shadow-sm line-clamp-3 sm:line-clamp-4">
                           “{tagline}”
                        </p>
                     </div>
                  )}

                  {genreIds && genreIds.length > 0 && (
                     <GenresList genreIds={genreIds} />
                  )}

                  <div className="mt-1 flex items-center flex-wrap tracking-tighter gap-2 drop-shadow-md cursor-default">
                     {Number(rating) > 0 && (
                        <>
                           <StarRating text={Number(rating).toFixed(1)} />
                           <span className="text-white/20">•</span>
                        </>
                     )}

                     {releaseYear && (
                        <>
                           <span>{releaseYear}</span>
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
