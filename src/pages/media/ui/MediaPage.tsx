"use client";

import { Link } from "@/app/i18n/navigation";
import {
   CrewMember,
   getMainCreators,
   MediaHeader,
   useGetMediaFullInfo,
} from "@/entities/media";
import { useIsPortrait } from "@/shared/lib/hooks/useIsPortrait";
import { useTmdbImagePath } from "@/shared/lib/hooks/useTmdbImagePath";
import { MediaType } from "@/shared/types/media-types";
import { BackgroundImage } from "@/shared/ui/BackgroundImage";
import { Button } from "@base-ui/react";
import { FilmIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { DetailsSection } from "./DetailsSection";

const navList = [
   { id: "01", text: "details", href: "#details" },
   { id: "02", text: "cast", href: "#cast" },
   { id: "03", text: "moreLike", href: "#more" },
];

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

   console.log(extraMedia);

   return (
      <div className="w-full">
         <div className="flex-1 min-h-[calc(100dvh-50px)] sm:min-h-screen transition-[min-height] duration-300 ease-out relative flex flex-col justify-end bg-black lg:bg-[#010101]">
            <BackgroundImage
               src={backdrop}
               alt={extraMedia?.title ?? "Nothing"}
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
                  <Button className="w-fit text-sm flex items-center gap-2 cursor-pointer mt-5 hover:text-zinc-300 transition-colors duration-500">
                     <FilmIcon className="h-6 w-6" />
                     {t("media.watchTrailer")}
                  </Button>
               </MediaHeader>
               <p className="z-999">this is hellow</p>
            </div>
         </div>

         <div className="w-full px-4 sm:px-8 mt-20 text-zinc-500 space-y-10 sm:space-y-20">
            {/* Synopsis */}
            <div className="w-full flex gap-5 sm:gap-10 md:gap-20 flex-wrap md:flex-nowrap justify-between items-start">
               <div className="flex flex-col gap-2 text-sm w-full md:w-fit min-w-0">
                  <h3 className="text-base text-zinc-400">
                     {t("media.story")}
                  </h3>
                  <h2 className="w-fit text-3xl text-zinc-100 text-wrap font-medium tracking-tighter">
                     {t("media.beforeCredits")}
                  </h2>
               </div>

               <div className="flex flex-col gap-4 w-full md:w-5/9 min-w-0">
                  <h3 className="text-zinc-400 text-lg">
                     {t("media.synopsis")}
                  </h3>
                  <p className="text-base w-full lg:w-4/5 tracking-wide">
                     {extraMedia?.overview}
                  </p>
               </div>
            </div>

            {/* Navigation */}
            <div className="w-full border-t border-b py-6">
               <ul className="flex gap-4 items-center text-xs">
                  {navList.map((item) => (
                     <li key={item.id}>
                        <Button>
                           <a href={item.href}>
                              <h2>
                                 {item.id}{" "}
                                 <span className="text-zinc-300 ml-1">
                                    {t(`media.menu.${item.text}`)}
                                 </span>
                              </h2>
                           </a>
                        </Button>
                     </li>
                  ))}
               </ul>
            </div>

            {/* Details Section */}
            <DetailsSection
               extraMedia={extraMedia}
               mediaType={mediaType}
            />
         </div>
      </div>
   );
}
