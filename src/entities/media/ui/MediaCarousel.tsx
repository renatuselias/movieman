"use client";

import {
   Carousel,
   CarouselContent,
   CarouselItem,
   CarouselNext,
   CarouselPrevious,
} from "@/shared/ui/carousel";
import { useCallback, useMemo, useState } from "react";
import WheelGesturesPlugin from "embla-carousel-wheel-gestures";
import { BaseMedia, MediaCard } from "@/entities/media";
import { Skeleton } from "@/shared/ui/skeleton";
import { TmdbSize } from "@/shared/types/media-types";
import { useTmdbImagePath } from "@/shared/lib/hooks/useTmdbImagePath";
import { MediaModal } from "@/widgets/media-modal";
import { ContentTitle } from "@/shared/ui/ContentTitle";

interface MediaCarouselProps {
   medias: BaseMedia[];
   isLoading: boolean;
   title: string;
   subtitle: string;
   mediaCount?: number;
   id: string;
}

export function MediaCarousel({
   medias,
   mediaCount = 12,
   isLoading,
   title,
   subtitle,
   id,
}: MediaCarouselProps) {
   const [selectedItem, setSelectedItem] = useState<BaseMedia | null>(null);
   const posterUrl = useTmdbImagePath("poster");

   const wheelPlugin = useMemo(
      () => WheelGesturesPlugin({ forceWheelAxis: "x" }),
      [],
   );

   const tmdbSize: TmdbSize = posterUrl.includes("w300") ? "w300" : "w780";

   const handleCloseModal = useCallback(() => {
      setSelectedItem(null);
   }, []);

   return (
      <section
         id={id}
         className="w-full flex flex-col gap-5 sm:gap-10"
      >
         {isLoading ? (
            <div className="flex flex-col gap-4">
               <Skeleton className="w-40 h-4" />
               <Skeleton className="w-70 h-8" />
            </div>
         ) : (
            <ContentTitle
               title={title}
               subtitle={subtitle}
            />
         )}
         <Carousel
            opts={{
               align: "start",
               loop: true,
               watchDrag: true,
            }}
            className="w-full relative"
            plugins={[wheelPlugin]}
         >
            <CarouselContent className="-ml-1">
               {isLoading
                  ? Array.from({ length: 6 }).map((_, index) => (
                       <CarouselItem
                          key={`skeleton-${index}`}
                          className="pl-1 sm:pl-3 basis-1/2 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
                       >
                          <div className="flex flex-col h-full rounded-none overflow-hidden shadow-lg border border-zinc-800/60 bg-zinc-950">
                             <Skeleton className="aspect-2/3 w-full rounded-none" />
                             <div className="p-3 flex flex-col justify-between grow gap-1.5 border-t border-zinc-800/60">
                                <Skeleton className="h-4 w-3/4 rounded-sm" />
                                <Skeleton className="h-3 w-1/2 rounded-sm" />
                             </div>
                          </div>
                       </CarouselItem>
                    ))
                  : medias.slice(0, mediaCount).map((item) => {
                       return (
                          <CarouselItem
                             key={`${item.id}-${item.character || item.posterPath}`}
                             className="pl-1 sm:pl-3 basis-1/2 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
                          >
                             <MediaCard
                                key={item.id}
                                tmdbSize={tmdbSize}
                                genreIds={item.genreIds}
                                overview={item.overview}
                                rating={item.rating}
                                title={item.title}
                                posterPath={item.posterPath}
                                mediaType={item.mediaType}
                                releaseDate={item.releaseDate}
                                onClick={() => setSelectedItem(item)}
                                character={item.character}
                                job={item.job}
                             />
                          </CarouselItem>
                       );
                    })}
            </CarouselContent>

            {/* Carousel navigation controls */}
            <div className="flex justify-end gap-2 mt-4">
               <CarouselPrevious className="static translate-y-0 rounded-xs bg-zinc-900/90 hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:text-white cursor-pointer w-9 h-9" />
               <CarouselNext className="static translate-y-0 rounded-xs bg-zinc-900/90 hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:text-white cursor-pointer w-9 h-9" />
            </div>
         </Carousel>

         {selectedItem && (
            <MediaModal
               mediaId={selectedItem.id}
               mediaType={selectedItem.mediaType}
               onClose={handleCloseModal}
            />
         )}
      </section>
   );
}
