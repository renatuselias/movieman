"use client";

import { useState, useCallback } from "react";
import { BaseMedia, MediaCard, MediaType } from "@/entities/media";
import { ContentTitle } from "@/shared/ui/ContentTitle";
import { MediaModal } from "@/widgets/media-modal";
import { useLocale, useTranslations } from "next-intl";
import { useGetMedias } from "@/entities/media/model/use-get-medias";
import { Skeleton } from "@/shared/ui/skeleton";
import { useTmdbImagePath } from "@/shared/lib/hooks/useTmdbImagePath";
import { TmdbSize } from "@/shared/types/media-types";

interface MediaGridProps {
   title: string;
   subtitle: string;
   mediaType: MediaType;
   mediaCount?: number;
}

export function MediaGrid({
   title,
   subtitle,
   mediaCount = 12,
}: MediaGridProps) {
   const t = useTranslations("mediaDetail");
   const locale = useLocale();
   const [selectedItem, setSelectedItem] = useState<BaseMedia | null>(null);
   const posterUrl = useTmdbImagePath("poster");
   const tmdbSize: TmdbSize = posterUrl.includes("w300") ? "w300" : "w780";

   const handleCloseModal = useCallback(() => {
      setSelectedItem(null);
   }, []);

   const { data: medias = [], isLoading } = useGetMedias({
      shouldFetch: true,
      locale,
      limit: mediaCount,
   });

   const showSkeleton = isLoading && medias?.length === 0;

   return (
      <section className="w-full flex flex-col gap-5 sm:gap-10">
         <ContentTitle
            title={title}
            subtitle={subtitle}
         />

         <div className="grid gap-3 grid-cols-2 md:grid-cols-4 md:gap-4 lg:grid-cols-6">
            {showSkeleton
               ? Array.from({ length: mediaCount }).map((_, index) => (
                    <div
                       key={index}
                       className="flex flex-col gap-2"
                    >
                       <Skeleton className="aspect-2/3 border border-zinc-800/30 w-full rounded-none" />
                       <div className="flex justify-between">
                          <Skeleton className="w-20 h-3" />
                          <Skeleton className="w-7 h-4" />
                       </div>
                       <Skeleton className="w-full h-5" />
                       <Skeleton className="hidden sm:block w-full h-4" />
                    </div>
                 ))
               : medias.slice(0, mediaCount).map((item) => (
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
                    />
                 ))}
         </div>

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
