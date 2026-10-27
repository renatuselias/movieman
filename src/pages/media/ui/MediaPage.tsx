"use client";

import { useMemo } from "react";
import { MediaHeader, useGetMediaFullInfo } from "@/entities/media";
import { useIsPortrait } from "@/shared/lib/hooks/useIsPortrait";
import { useTmdbImagePath } from "@/shared/lib/hooks/useTmdbImagePath";
import { MediaType } from "@/shared/types/media-types";
import { BackgroundImage } from "@/shared/ui/BackgroundImage";
import { Button } from "@base-ui/react";
import { FilmIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { DetailsSection } from "./DetailsSection";
import { MediaGrid } from "@/widgets/media-grid";
import { ContentTitle } from "@/shared/ui/ContentTitle";
import { Skeleton } from "@/shared/ui/skeleton";
import { DetailsSkeleton, SynopsisSkeleton } from "./MediaSkeletons";
import { MediaCast } from "@/widgets/media-cast/ui/MediaCast";
import { GallerySkeleton, MediaGallery } from "@/widgets/media-gallery";
import { TmdbImage } from "@/shared/ui/TmdbImage";
import { Link } from "@/app/i18n/navigation";

export function MediaPage({
   mediaType,
   mediaId,
}: {
   mediaType: MediaType;
   mediaId: number;
}) {
   const t = useTranslations();
   const locale = useLocale();

   const isPortrait = useIsPortrait();
   const imageBaseUrl = useTmdbImagePath(isPortrait ? "poster" : "backdrop");

   const { data: extraMedia, isLoading } = useGetMediaFullInfo(
      mediaId,
      mediaType,
      locale,
   );

   const rawPath = isPortrait
      ? extraMedia?.posterPath
      : extraMedia?.backdropPath;
   const backdrop = rawPath ? `${imageBaseUrl}${rawPath}` : null;

   const hasCast =
      isLoading || Boolean(extraMedia?.cast && extraMedia.cast.length > 0);
   const hasGallery =
      isLoading ||
      Boolean(
         (extraMedia?.backdrops && extraMedia.backdrops.length > 0) ||
         (extraMedia?.posters && extraMedia.posters.length > 0) ||
         (extraMedia?.videos && extraMedia.videos.length > 0),
      );
   const hasRecommendations =
      isLoading ||
      Boolean(
         extraMedia?.recommendations && extraMedia.recommendations.length > 0,
      );

   const navList = useMemo(() => {
      return [
         { id: "details", text: "details", href: "#details", show: true },
         { id: "cast", text: "cast", href: "#cast", show: hasCast },
         { id: "gallery", text: "gallery", href: "#gallery", show: hasGallery },
         {
            id: "moreLike",
            text: "moreLike",
            href: "#more",
            show: hasRecommendations,
         },
      ].filter((item) => item.show);
   }, [hasCast, hasGallery, hasRecommendations]);

   console.log(extraMedia);

   return (
      <div className="w-full">
         {/* Hero Section */}
         <div className="flex-1 min-h-[calc(100dvh-50px)] sm:min-h-screen transition-[min-height] duration-300 ease-out relative flex flex-col justify-end bg-black lg:bg-[#010101]">
            <BackgroundImage
               src={backdrop}
               alt={extraMedia?.title ?? "Media Backdrop"}
               imageKey={mediaId}
               loadingText={t("loaders.loadingPoster")}
               isLoading={isLoading}
            />
            <div className="w-full px-4 sm:px-8 pt-20 flex justify-between items-end pb-5 sm:pb-20">
               <MediaHeader
                  id={mediaId}
                  mediaType={mediaType}
                  media={extraMedia}
                  isLoading={isLoading}
                  isMediaPage={true}
               >
                  {extraMedia?.videos && extraMedia.videos.length > 0 && (
                     <Button className="w-fit text-sm flex items-center gap-2 cursor-pointer mt-5 hover:text-zinc-300 transition-colors duration-500">
                        <FilmIcon className="h-6 w-6" />
                        {t("media.watchTrailer")}
                     </Button>
                  )}
               </MediaHeader>
            </div>
         </div>

         {/* Main Content Section */}
         <div className="w-full px-4 sm:px-10 mt-20 text-zinc-500 space-y-10 sm:space-y-20">
            {/* Synopsis */}
            <div className="w-full flex gap-5 sm:gap-10 md:gap-20 flex-wrap md:flex-nowrap justify-between items-start">
               {isLoading ? (
                  <SynopsisSkeleton />
               ) : (
                  <>
                     <ContentTitle
                        title={t("media.beforeCredits")}
                        subtitle={t("media.story")}
                     />
                     <div className="flex flex-col gap-4 w-full md:w-5/9 min-w-0">
                        <h3 className="text-zinc-400 text-xl">
                           {t("media.synopsis")}
                        </h3>
                        <p className="text-base w-full lg:w-4/5 leading-relaxed tracking-tighter text-neutral-300 font-normal overflow-hidden text-ellipsis display-webkit-box">
                           {extraMedia?.overview}
                        </p>
                     </div>
                  </>
               )}
            </div>

            {/* Navigation */}
            {navList.length > 1 && (
               <div className="w-full border-t border-b py-6">
                  {isLoading ? (
                     <div className="flex gap-3">
                        <Skeleton className="w-20 h-4" />
                        <Skeleton className="w-20 h-4" />
                        <Skeleton className="w-20 h-4" />
                     </div>
                  ) : (
                     <nav>
                        <ul className="flex gap-4 items-center text-xs">
                           {navList.map((item, index) => (
                              <li key={item.id}>
                                 <a
                                    href={item.href}
                                    className="inline-block hover:opacity-80 transition-opacity cursor-pointer"
                                 >
                                    <h2>
                                       {String(index + 1).padStart(2, "0")}{" "}
                                       <span className="text-zinc-300 ml-1">
                                          {t(`media.menu.${item.text}`)}
                                       </span>
                                    </h2>
                                 </a>
                              </li>
                           ))}
                        </ul>
                     </nav>
                  )}
               </div>
            )}

            {/* Details */}
            {isLoading ? (
               <DetailsSkeleton />
            ) : (
               <DetailsSection
                  extraMedia={extraMedia}
                  mediaType={mediaType}
               />
            )}

            {/* Cast */}
            {hasCast && (
               <MediaCast
                  mediaLoading={isLoading}
                  mediaCast={extraMedia?.cast || []}
               />
            )}

            {/* Gallery */}
            {isLoading ? (
               <GallerySkeleton />
            ) : (
               hasGallery && (
                  <MediaGallery
                     backdrops={extraMedia?.backdrops}
                     posters={extraMedia?.posters}
                     videos={extraMedia?.videos}
                     title={t("media.menu.gallery")}
                     subtitle={t("media.subGallery")}
                  />
               )
            )}

            {/* Collection */}
            {extraMedia?.belongsToCollection && (
               <section
                  aria-label={extraMedia.belongsToCollection.name}
                  className="relative isolate flex min-h-40 w-full items-center justify-between gap-4 overflow-hidden border border-zinc-800 bg-zinc-950 p-4 sm:min-h-100 sm:gap-8 sm:p-8"
               >
                  <div className="absolute inset-0 z-0">
                     <TmdbImage
                        src={extraMedia.belongsToCollection.backdrop_path}
                        alt=""
                        fill
                        sizes="100vw"
                        className="object-cover"
                     />
                  </div>
                  <div className="absolute inset-0 z-10 bg-linear-to-r from-black/90 via-black/70 to-black/35" />
                  <div className="relative z-20 flex w-full items-center justify-between gap-4 sm:gap-8">
                     <div className="flex flex-col gap-4">
                        <h2 className="peer tracking-tighter text-xl sm:text-3xl md:text-4xl text-zinc-300">
                           {extraMedia.belongsToCollection.name}
                        </h2>

                        <Link
                           className="w-fit transition-colors duration-300 hover:text-white cursor-pointer text-base sm:text-xl uppercase tracking-tight"
                           href={`${extraMedia.belongsToCollection.id}`}
                        >
                           {t("media.viewCollection")}
                        </Link>
                     </div>

                     {extraMedia.belongsToCollection.poster_path && (
                        <Link
                           href={`${extraMedia.belongsToCollection.id}`}
                           className="relative hidden sm:block sm:w-40 md:w-60 lg:w-80 aspect-2/3 shrink-0 overflow-hidden rounded-xl"
                        >
                           <TmdbImage
                              src={extraMedia.belongsToCollection.poster_path}
                              alt={extraMedia.belongsToCollection.name}
                              fill
                              sizes="(max-width: 640px) 80px, 144px"
                              className="object-cover transition-[filter] duration-300 hover:brightness-125 peer-hover:brightness-125"
                           />
                           <div className="pointer-events-none absolute inset-0 z-10 bg-black/40 transition-opacity duration-300 hover:opacity-0 peer-hover:opacity-0" />
                        </Link>
                     )}
                  </div>
               </section>
            )}

            {/* Recommendations */}
            {hasRecommendations && (
               <MediaGrid
                  title={t("media.followThread")}
                  subtitle={t("media.recommendations")}
                  recommendations={extraMedia?.recommendations}
                  recommendationsLoading={isLoading}
               />
            )}
         </div>
      </div>
   );
}
