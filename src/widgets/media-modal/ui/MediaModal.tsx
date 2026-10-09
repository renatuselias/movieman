"use client";

import type { ReactNode } from "react";
import {
   GenresList,
   Info,
   Tagline,
   useGetMediaDetails,
} from "@/entities/media";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { BackgroundImage } from "@/shared/ui/BackgroundImage";
import { useTmdbImagePath } from "@/shared/lib/hooks/useTmdbImagePath";
import { MediaLogo } from "@/entities/media/ui/MediaLogo";
import { CastList } from "@/entities/media/ui/CastList";
import { Link } from "@/app/i18n/navigation";
import { Skeleton } from "@/shared/ui/skeleton";

interface MediaModalProps {
   mediaId: number;
   mediaType: "movie" | "tv";
   onClose: () => void;
}

function MediaDetailRow({
   label,
   isCast = false,
   children,
}: {
   label: string;
   isCast?: boolean;
   children: ReactNode;
}) {
   return (
      <div className="flex items-center gap-6">
         <h3
            className={`${isCast ? "self-start mt-2" : ""} w-22 shrink-0 uppercase text-zinc-500 text-[10px] font-semibold tracking-widest`}
         >
            {label}
         </h3>
         {children}
      </div>
   );
}

export function MediaModal({ mediaId, mediaType, onClose }: MediaModalProps) {
   const t = useTranslations();

   const imageBaseUrl = useTmdbImagePath("backdrop");

   const { data: extraMedia, isLoading } = useGetMediaDetails(
      mediaId,
      mediaType,
   );

   const backdrop = `${imageBaseUrl}${extraMedia?.backdropPath}`;

   const {
      title,
      tagline,
      logoPath,
      releaseDate,
      runtime,
      genreIds,
      overview,
      rating,
      productionCountries,
      numberOfSeasons,
      cast,
      createdBy,
   } = extraMedia || {};

   return (
      <Dialog
         open={true}
         onOpenChange={(open) => !open && onClose()}
      >
         <DialogContent
            tabIndex={-1}
            style={{ border: "none", boxShadow: "none", outline: "none" }}
            className="fixed top-1/2 left-1/2! -translate-x-1/2! -translate-y-1/2!
            w-[90vw]! max-w-[90vw]! lg:w-240! lg:max-w-240! max-h-[90dvh] overflow-y-auto
             bg-black! border-0! shadow-none! ring-0! outline-none!
             focus:outline-none! focus-visible:outline-none! rounded-none!
             px-0! py-0! pb-10! sm:pb-20!"
         >
            <div className="flex flex-col relative bg-black ">
               <div className="aspect-video relative w-full">
                  {isLoading ? (
                     <Skeleton
                        className="w-full aspect-video"
                        aria-hidden="true"
                     />
                  ) : (
                     <BackgroundImage
                        src={backdrop}
                        alt={extraMedia?.title ?? ""}
                        imageKey={mediaId}
                        loadingText={t("loaders.loadingPoster")}
                        aspectRatio="16/9"
                     />
                  )}
               </div>

               {isLoading ? (
                  <div className="w-full px-4 sm:px-8 md:px-12 z-50 -mt-10 text-zinc-300">
                     {/* logo */}
                     <Skeleton className="h-12 w-64 sm:h-16 sm:w-80 md:h-20" />
                     {/* tagline */}
                     <Skeleton className="h-6 w-full sm:w-2/4 mt-5" />
                     {/* info */}
                     <div className="flex items-center gap-2 mt-3">
                        <Skeleton className="h-4 w-10" />
                        <span className="text-white/20">•</span>
                        <Skeleton className="h-4 w-11" />
                        <span className="text-white/20">•</span>
                        <Skeleton className="h-4 w-14" />
                        <span className="text-white/20">•</span>
                        <Skeleton className="h-4 w-14" />
                     </div>
                     {/* overview */}
                     <div className="mt-5 space-y-2">
                        <Skeleton className="w-full h-5" />
                        <Skeleton className="w-full h-5" />
                        <Skeleton className="w-full h-5" />
                     </div>
                     {/* cast, creator, genres */}
                     <div className="mt-7 space-y-2">
                        <div className="flex gap-15">
                           <Skeleton className="w-20 h-5" />
                           <Skeleton className="flex-1 h-5" />
                        </div>
                        <div className="flex gap-15">
                           <Skeleton className="w-20 h-5" />
                           <Skeleton className="w-1/3 h-5" />
                        </div>
                        <div className="flex gap-15">
                           <Skeleton className="w-20 h-5" />
                           <Skeleton className="w-2/4 h-5" />
                        </div>
                     </div>
                  </div>
               ) : (
                  <div className="w-full px-4 sm:px-8 md:px-12 z-50 -mt-10 space-y-5 text-zinc-300">
                     <MediaLogo
                        logoPath={logoPath ?? null}
                        title={title ?? ""}
                        mediaId={mediaId}
                        mediaType={mediaType}
                        size={"w-50 md:w-60"}
                     />
                     <Tagline tagline={tagline ?? null} />

                     <Info
                        rating={rating ?? 0}
                        releaseDate={releaseDate ?? null}
                        mediaType={mediaType}
                        runtime={runtime ?? 0}
                        numberOfSeasons={numberOfSeasons ?? 0}
                        productionCountries={productionCountries ?? null}
                     />

                     {overview && (
                        <p className="mt-4 line-clamp-3 text-base">
                           {overview}
                        </p>
                     )}

                     <div className="flex flex-col gap-3">
                        {cast && (
                           <MediaDetailRow
                              isCast={true}
                              label={t("media.mediaDetails.cast")}
                           >
                              <CastList
                                 cast={cast}
                                 textList={true}
                              />
                           </MediaDetailRow>
                        )}
                        {createdBy && (
                           <MediaDetailRow
                              label={t("media.mediaDetails.director")}
                           >
                              <Link
                                 className="text-sm hover:text-zinc-200 hover:scale-105 transform transition-all duration-500"
                                 href={`/person/${createdBy.id}`}
                              >
                                 {createdBy.name}
                              </Link>
                           </MediaDetailRow>
                        )}

                        {genreIds && (
                           <MediaDetailRow label={t("genres.genres")}>
                              <GenresList genreIds={genreIds} />
                           </MediaDetailRow>
                        )}
                     </div>
                  </div>
               )}
            </div>
         </DialogContent>
      </Dialog>
   );
}
