"use client";

import { useState, useCallback } from "react";
import { BaseMedia, MediaCard } from "@/entities/media";
import { ContentTitle } from "@/shared/ui/ContentTitle";
import { MediaModal } from "@/widgets/media-modal";
import { useGetMedias } from "@/entities/media/model/use-get-medias";
import { Skeleton } from "@/shared/ui/skeleton";
import { useTmdbImagePath } from "@/shared/lib/hooks/useTmdbImagePath";
import {
   MediaParams,
   MediaTypeWithAll,
   TmdbSize,
} from "@/shared/types/media-types";

interface MediaGridProps {
   title: string;
   subtitle: string;
   mediaType?: MediaTypeWithAll;
   mediaCount?: number;
   params?: MediaParams;
   recommendations?: BaseMedia[];
   recommendationsLoading?: boolean;
}

export function MediaGrid({
   title,
   subtitle,
   mediaType,
   mediaCount = 12,
   params,
   recommendations = [],
   recommendationsLoading = false,
}: MediaGridProps) {
   const [selectedItem, setSelectedItem] = useState<BaseMedia | null>(null);
   const posterUrl = useTmdbImagePath("poster");
   const tmdbSize: TmdbSize = posterUrl.includes("w300") ? "w300" : "w780";

   const handleCloseModal = useCallback(() => {
      setSelectedItem(null);
   }, []);

   const shouldFetch = Boolean(params) && recommendations.length < 1;

   const { data: fetchMedias = [], isLoading } = useGetMedias({
      ...params,
      mediaType,
      limit: mediaCount,
      enabled: shouldFetch,
   });

   const showSkeleton =
      (isLoading && fetchMedias?.length === 0) || recommendationsLoading;

   const medias = recommendations.length > 0 ? recommendations : fetchMedias;

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
