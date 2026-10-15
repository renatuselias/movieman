"use client";

import { useGetMediaFullInfo } from "@/entities/media";
import { useIsPortrait } from "@/shared/lib/hooks/useIsPortrait";
import { useTmdbImagePath } from "@/shared/lib/hooks/useTmdbImagePath";
import { MediaType } from "@/shared/types/media-types";
import { BackgroundImage } from "@/shared/ui/BackgroundImage";
import { MediaGrid } from "@/widgets/media-grid";
import { useLocale, useTranslations } from "next-intl";

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

   // Pure Hook call without optional chaining
   const { data: extraMedia, isLoading } = useGetMediaFullInfo(
      mediaId,
      mediaType,
      locale,
   );

   const rawPath = isPortrait
      ? extraMedia?.posterPath
      : extraMedia?.backdropPath;
   const backdrop = rawPath ? `${imageBaseUrl}${rawPath}` : null;

   console.log(extraMedia);

   return (
      <div className="w-full">
         <div className="flex-1 min-h-[calc(100svh-55px)] sm:min-h-screen relative flex flex-col justify-end bg-black lg:bg-[#010101]">
            <BackgroundImage
               src={backdrop}
               alt={extraMedia?.title ?? "Nothing"}
               imageKey={mediaId}
               loadingText={t("loaders.loadingPoster")}
               isLoading={isLoading}
            />
         </div>

         <div className="w-full max-w-375 px-4 sm:px-8 mx-auto space-y-20 md:space-y-48 mt-12 sm:mt-16 lg:mt-52">
            {/* <MediaFullInfo
               media={media}
               mediaType={mediaType}
               isLoading={isLoading}
            />

            <MediaGrid
               title=""
               subtitle=""
               media={media?.recommendations}
               mediaType={mediaType}
               isMediaPage={true}
            /> */}
         </div>
      </div>
   );
}
