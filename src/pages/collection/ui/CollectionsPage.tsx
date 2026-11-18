"use client";

import { useGetCollection } from "@/entities/collection";
import { GenresList, mapToBaseMedia } from "@/entities/media";
import { mapToBaseCast } from "@/entities/media/lib/mappers/credits.mapper";
import { SynopsisSkeleton } from "@/pages/media/ui/MediaSkeletons";
import { PersonDetailItem } from "@/pages/media/ui/PersonDetail";
import { TextDetailItem } from "@/pages/media/ui/TextDetail";
import { useIsPortrait } from "@/shared/lib/hooks/useIsPortrait";
import { useTmdbImagePath } from "@/shared/lib/hooks/useTmdbImagePath";
import { getMediaCrew } from "@/shared/lib/media-crew";
import { BackgroundImage } from "@/shared/ui/BackgroundImage";
import { ContentTitle } from "@/shared/ui/ContentTitle";
import { Skeleton } from "@/shared/ui/skeleton";
import { MediaCast } from "@/widgets/media-cast/ui/MediaCast";
import { GallerySkeleton, MediaGallery } from "@/widgets/media-gallery";
import { MediaGrid } from "@/widgets/media-grid";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";

export function CollectionPage({ collectionId }: { collectionId: number }) {
   const t = useTranslations();

   const locale = useLocale();
   const isPortrait = useIsPortrait();
   const imageBaseUrl = useTmdbImagePath(isPortrait ? "poster" : "backdrop");

   const { data: collectionDetails, isLoading } = useGetCollection(
      collectionId,
      locale,
   );

   const rawPath = isPortrait
      ? collectionDetails?.poster_path
      : collectionDetails?.backdrop_path;

   const backdrop = rawPath ? `${imageBaseUrl}${rawPath}` : null;
   console.log(collectionDetails);

   const uniqueGenreIds = new Set(
      collectionDetails?.parts?.flatMap((item) => item.genre_ids || []),
   );
   const genreIdsArray = Array.from(uniqueGenreIds);

   const cast = collectionDetails?.cast ? collectionDetails.cast : [];

   const collectionCast = mapToBaseCast(cast);

   const hasCast =
      isLoading ||
      Boolean(collectionDetails?.cast && collectionDetails.cast.length > 0);

   const hasGallery =
      isLoading ||
      Boolean(
         (collectionDetails?.images.backdrops &&
            collectionDetails.images.backdrops.length > 0) ||
         (collectionDetails?.images.posters &&
            collectionDetails.images.posters.length > 0),
      );

   const navList = useMemo(() => {
      return [
         { id: "details", text: "details", href: "#details", show: true },
         { id: "cast", text: "cast", href: "#cast", show: hasCast },
         {
            id: "gallery",
            text: "gallery",
            href: "#gallery",
            show: hasGallery,
         },
         { id: "more", text: "movies", href: "#more", show: true },
      ].filter((item) => item.show);
   }, [hasCast, hasGallery]);

   const directors = getMediaCrew("directors", collectionDetails?.creators);
   const writers = getMediaCrew("writers", collectionDetails?.creators);

   return (
      <div className="flex flex-col">
         <div className="flex-1 min-h-[calc(100dvh-50px)] sm:min-h-screen transition-[min-height] duration-300 ease-out relative flex flex-col justify-end bg-black lg:bg-[#010101]">
            <BackgroundImage
               src={backdrop}
               alt={collectionDetails?.original_name || ""}
               loadingText={t("loaders.loadingPoster")}
               isLoading={isLoading}
            />

            <div className="w-full z-10 custom-container pt-20 pb-5 sm:pb-20">
               <h1 className="inline text-3xl sm:text-5xl bg-linear-to-r from-zinc-100 via-zinc-400 to-zinc-600 bg-clip-text font-bold text-transparent leading-tight">
                  {collectionDetails?.name}
               </h1>
               <h3 className="text-xl">
                  {`${t("media.countOfParts", {
                     count: Number(collectionDetails?.parts.length),
                  })}`}
               </h3>
            </div>
         </div>

         <div className="custom-container mt-10 space-y-10 sm:space-y-20">
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
                           {collectionDetails?.overview}
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
                        <ul className="flex flex-wrap gap-4 items-center text-xs">
                           {navList.map((item, index) => (
                              <li key={item.id}>
                                 <a
                                    href={item.href}
                                    className="inline-block hover:opacity-80 transition-opacity cursor-pointer"
                                 >
                                    <h2>
                                       {String(index + 1).padStart(2, "0")}{" "}
                                       <span className="text-zinc-300 sm:ml-1">
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

            <div
               id="details"
               className="w-full flex gap-5 sm:gap-10 md:gap-20 flex-wrap md:flex-nowrap justify-between items-start"
            >
               <ContentTitle
                  title={t("media.menu.details")}
                  subtitle={t("media.moreContext")}
               />

               <div className="flex flex-col gap-4 w-full md:w-6/9 min-w-0">
                  <div className="grid grid-cols-2 gap-x-8 sm:gap-x-12 gap-y-6">
                     <PersonDetailItem
                        title={t("media.mediaDetails.creators")}
                        items={directors}
                     />
                     <PersonDetailItem
                        title={t("media.mediaDetails.screenplay")}
                        items={writers}
                     />

                     <TextDetailItem
                        title={t("media.mediaDetails.originalTitle")}
                     >
                        {collectionDetails?.original_name}
                     </TextDetailItem>

                     <TextDetailItem title={t("genres.genres")}>
                        <GenresList genreIds={genreIdsArray} />
                     </TextDetailItem>

                     <TextDetailItem title={t("media.mediaDetails.budget")}>
                        {collectionDetails?.totalBudget}
                     </TextDetailItem>
                     <TextDetailItem title={t("media.mediaDetails.revenue")}>
                        {collectionDetails?.totalRevenue}
                     </TextDetailItem>
                  </div>
               </div>
            </div>

            {/* Cast */}
            {hasCast && (
               <MediaCast
                  mediaLoading={isLoading}
                  mediaCast={collectionCast.slice(0, 100) || []}
               />
            )}

            {/* Gallery */}
            {isLoading ? (
               <GallerySkeleton />
            ) : (
               hasGallery && (
                  <MediaGallery
                     backdrops={collectionDetails?.images.backdrops.map(
                        (i) => i.file_path,
                     )}
                     posters={collectionDetails?.images.posters.map(
                        (i) => i.file_path,
                     )}
                     title={t("media.menu.gallery")}
                     subtitle={t("media.subGallery")}
                  />
               )
            )}

            <MediaGrid
               title={t("media.fullSaga")}
               subtitle={t("media.fullSagaSub")}
               recommendations={collectionDetails?.parts.map((item) =>
                  mapToBaseMedia(item),
               )}
            />
         </div>
      </div>
   );
}
