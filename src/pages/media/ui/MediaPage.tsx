"use client";

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

const NAV_LIST = [
   { id: "01", text: "details", href: "#details" },
   { id: "02", text: "cast", href: "#cast" },
   { id: "03", text: "moreLike", href: "#more" },
] as const;

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

   return (
      <div className="w-full">
         {/* Hero / Backdrop Section */}
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
         <div className="w-full px-4 sm:px-8 mt-20 text-zinc-500 space-y-10 sm:space-y-20">
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
                        <p className="text-base w-full lg:w-4/5 tracking-wide">
                           {extraMedia?.overview}
                        </p>
                     </div>
                  </>
               )}
            </div>

            {/* Navigation */}
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
                        {NAV_LIST.map((item) => (
                           <li key={item.id}>
                              <a
                                 href={item.href}
                                 className="inline-block hover:opacity-80 transition-opacity cursor-pointer"
                              >
                                 <h2>
                                    {item.id}{" "}
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

            {/* Details Section */}
            {isLoading ? (
               <DetailsSkeleton />
            ) : (
               <DetailsSection
                  extraMedia={extraMedia}
                  mediaType={mediaType}
               />
            )}

            {/* Cast (Placeholder) */}
            <div id="cast"></div>

            {/* Recommendations */}
            <div
               className="w-full"
               id="more"
            >
               <MediaGrid
                  title={t("media.followThread")}
                  subtitle={t("media.recommendations")}
                  recommendations={extraMedia?.recommendations}
                  recommendationsLoading={isLoading}
               />
            </div>
         </div>
      </div>
   );
}
