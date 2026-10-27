"use client";

import { ReactNode } from "react";
import { Link } from "@/app/i18n/navigation";
import { Skeleton } from "@/shared/ui/skeleton";
import { useTranslations } from "next-intl";
import { MediaDetails } from "../model/types";
import { MediaLogo } from "./MediaLogo";
import { GenresList } from "./GenresList";
import { CastList } from "./CastList";
import { Tagline } from "./Tagline";
import { Info } from "./Info";
import { MediaType } from "@/shared/types/media-types";

interface MediaDetailsProps {
   id: number;
   mediaType: MediaType;
   children?: ReactNode;
   media?: MediaDetails | null;
   isLoading: boolean;
   isMediaPage?: boolean;
}

export function MediaHeader({
   id: mediaId,
   mediaType,
   children,
   media,
   isLoading,
   isMediaPage = false,
}: MediaDetailsProps) {
   const t = useTranslations("media.mediaDetails");

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
               <Skeleton className="h-8 w-64 mt-6" />
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

                  {!isMediaPage && cast && (
                     <CastList
                        mediaId={mediaId}
                        mediaType={mediaType}
                        cast={cast}
                        textList={false}
                     />
                  )}

                  {!isMediaPage && createdBy && createdBy.length > 0 && (
                     <div className="text-sm text-zinc-500 mt-2">
                        <span className="flex items-center gap-2">
                           {t("createdBy")}
                           <Link
                              className="text-base text-zinc-400 hover:text-zinc-300 transition-all duration-500"
                              href={`person/${createdBy[0]?.id}`}
                           >
                              {createdBy[0]?.name}
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
