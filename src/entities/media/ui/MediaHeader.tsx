"use client";

import { ReactNode } from "react";
import { Link } from "@/app/i18n/navigation";
import { Skeleton } from "@/shared/ui/skeleton";
import { useTranslations } from "next-intl";
import { HeaderInfo } from "../model/types";
import { MediaLogo } from "./MediaLogo";
import { GenresList } from "./GenresList";
import { CastList } from "./CastList";
import { Tagline } from "./Tagline";
import { Info } from "./Info";

interface MediaDetailsProps {
   id: number;
   mediaType: "movie" | "tv";
   children?: ReactNode;
   media?: HeaderInfo | null;
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
      cast,
      createdBy,
   } = media || {};

   return (
      <div className="space-y-3 sm:space-y-5 w-full sm:max-w-2xl">
         {isLoading ? (
            <div className="animate-[fadeInUp_0.8s_ease-out]">
               <Skeleton className="h-12 w-64 sm:h-16 sm:w-80 md:h-20 mb-4 sm:mb-8" />
               <div className="space-y-2 max-w-xl">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-2/4" />
               </div>
               <div className="flex items-center gap-2 mt-3 sm:mt-4">
                  <Skeleton className="h-4 w-10" />
                  <span className="text-white/20">•</span>
                  <Skeleton className="h-4 w-11" />
                  <span className="text-white/20">•</span>
                  <Skeleton className="h-4 w-14" />
                  <span className="text-white/20">•</span>
                  <Skeleton className="h-4 w-14" />
               </div>
               <div className="flex gap-2 items-center mt-2">
                  <div className="flex -space-x-1">
                     <Skeleton className="h-8 w-8 rounded-full" />
                     <Skeleton className="h-8 w-8 rounded-full" />
                     <Skeleton className="h-8 w-8 rounded-full" />
                     <Skeleton className="h-8 w-8 rounded-full" />
                     <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                  <Skeleton className="h-5 w-28" />
               </div>
               <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                  <Skeleton className="h-5 w-2/5" />
               </div>
               <div>
                  <Skeleton className="mt-2 h-5 w-28" />
               </div>
            </div>
         ) : (
            <div className="space-y-3 sm:space-y-5 animate-[fadeInUp_0.8s_ease-out] will-change-transform">
               <MediaLogo
                  logoPath={logoPath ?? null}
                  title={title ?? ""}
                  mediaId={mediaId}
                  mediaType={mediaType}
               />

               {/* Media info */}
               <div className="flex flex-col gap-1 text-muted-foreground w-full text-base">
                  <Tagline tagline={tagline ?? null} />

                  <GenresList genreIds={genreIds ?? []} />

                  <Info
                     rating={rating ?? 0}
                     releaseDate={releaseDate ?? null}
                     mediaType={mediaType}
                     runtime={runtime ?? 0}
                     numberOfSeasons={numberOfSeasons ?? 0}
                     productionCountries={productionCountries ?? null}
                  />

                  {cast && (
                     <CastList
                        mediaId={mediaId}
                        mediaType={mediaType}
                        cast={cast}
                        textList={false}
                     />
                  )}

                  {createdBy && (
                     <div className="text-sm text-zinc-500 mt-2">
                        <span>
                           {t("createdBy")}{" "}
                           <Link
                              className="text-base text-zinc-400 hover:text-zinc-300 transition-all duration-500"
                              href={`person/${createdBy.id}`}
                           >
                              {createdBy.name}
                           </Link>
                        </span>
                     </div>
                  )}

                  {children}
               </div>
            </div>
         )}
      </div>
   );
}
