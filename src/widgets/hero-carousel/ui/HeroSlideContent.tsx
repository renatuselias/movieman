// widgets/hero-carousel/ui/HeroSlideContent.tsx
"use client";

import { useTranslations } from "next-intl";
import { InfoIcon } from "lucide-react";

import { BackgroundImage } from "@/shared/ui/BackgroundImage";
import { useTmdbImagePath } from "@/shared/lib/hooks/useTmdbImagePath";
import { useIsPortrait } from "@/shared/lib/hooks/useIsPortrait";
import { Link } from "@/app/i18n/navigation";

import {
   BaseMedia,
   HeaderInfo,
   MediaHeader,
   useGetExtras,
} from "@/entities/media";

interface HeroSlideContentProps {
   movie: BaseMedia;
   children?: React.ReactNode; // For CarouselNavigation slot
}

export function HeroSlideContent({ movie, children }: HeroSlideContentProps) {
   const t = useTranslations();
   const isPortrait = useIsPortrait();
   const imageBaseUrl = useTmdbImagePath(isPortrait ? "poster" : "backdrop");

   const { id: mediaId, title, backdropPath, posterPath, mediaType } = movie;

   // Pure Hook call without optional chaining
   const { data: extraMedia, isLoading } = useGetExtras(
      mediaId,
      mediaType,
      false,
   );

   const rawPath = isPortrait ? posterPath : backdropPath;
   const backdrop = rawPath ? `${imageBaseUrl}${rawPath}` : null;
   const mediaHref = `/${mediaType === "tv" ? "tvshow" : mediaType}/${mediaId}`;

   console.log(extraMedia);

   return (
      <>
         <BackgroundImage
            src={backdrop}
            alt={title}
            imageKey={mediaId}
            loadingText={t("loaders.loadingPoster")}
         />

         <div
            className="relative z-30 w-full
               px-4 sm:px-8 pt-20 lg:pt-24 pb-4 sm:pb-6
               flex flex-col-reverse sm:flex-row items-start sm:items-end justify-end sm:justify-between gap-4 sm:gap-10 
               mt-auto bg-linear-to-t from-black via-black/90 to-transparent sm:bg-none overflow-hidden"
         >
            <div className="flex flex-col w-full">
               <MediaHeader
                  id={mediaId}
                  mediaType={mediaType}
                  media={extraMedia as HeaderInfo}
                  isLoading={isLoading}
               >
                  <div className="flex gap-3 sm:gap-5 flex-wrap-reverse items-center mt-2">
                     <Link
                        href={mediaHref}
                        className="flex transition-all duration-700 bg-transparent items-center gap-1 text-xs text-zinc-400 hover:bg-transparent hover:text-zinc-300"
                     >
                        <span className="select-none uppercase tracking-widest">
                           {t("media.headerInfo.details")}
                        </span>
                        <InfoIcon
                           strokeWidth={1.5}
                           size={17}
                        />
                     </Link>
                  </div>
               </MediaHeader>
            </div>

            {/* CarouselNavigation */}
            {children}
         </div>
      </>
   );
}
