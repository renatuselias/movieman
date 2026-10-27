"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import {
   Film,
   IdCardIcon,
   Image as ImageIcon,
   Maximize2,
   Play,
} from "lucide-react";
import {
   Carousel,
   type CarouselApi,
   CarouselContent,
   CarouselItem,
   CarouselNext,
   CarouselPrevious,
} from "@/shared/ui/carousel";
import { TmdbImage } from "@/shared/ui/TmdbImage";
import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { GalleryModal } from "./GalleryModal";
import { ContentTitle } from "@/shared/ui/ContentTitle";

export interface MediaVideo {
   id: string;
   key: string;
   name: string;
   type?: string;
}

interface MediaGalleryProps {
   backdrops?: string[];
   posters?: string[];
   videos?: MediaVideo[];
   title: string;
   subtitle: string;
}

export function MediaGallery({
   backdrops = [],
   posters = [],
   videos = [],
   title,
   subtitle,
}: MediaGalleryProps) {
   const t = useTranslations("media");

   type MediaTab = "backdrops" | "posters" | "videos";
   const [selectedTab, setSelectedTab] = useState<MediaTab | null>(null);
   const activeTab =
      selectedTab ??
      (backdrops.length > 0
         ? "backdrops"
         : posters.length > 0
           ? "posters"
           : "videos");

   const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
   const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

   const wheelPlugin = useMemo(
      () => WheelGesturesPlugin({ forceWheelAxis: "x" }),
      [],
   );

   const currentItems = useMemo(() => {
      if (activeTab === "backdrops") return backdrops;
      if (activeTab === "posters") return posters;
      return videos;
   }, [activeTab, backdrops, posters, videos]);

   const selectedMedia =
      selectedIndex === null ? undefined : currentItems[selectedIndex];

   const navigateMedia = useCallback(
      (direction: -1 | 1) => {
         if (currentItems.length < 2) return;

         const nextIndex =
            selectedIndex === null
               ? 0
               : (selectedIndex + direction + currentItems.length) %
                 currentItems.length;
         setSelectedIndex(nextIndex);
         carouselApi?.scrollTo(nextIndex);
      },
      [carouselApi, currentItems.length, selectedIndex],
   );

   useEffect(() => {
      if (selectedIndex === null || currentItems.length === 0) return;

      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === "ArrowRight") {
            e.preventDefault();
            e.stopPropagation();
            navigateMedia(1);
         } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            e.stopPropagation();
            navigateMedia(-1);
         } else if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            setSelectedIndex(null);
         }
      };

      document.addEventListener("keydown", handleKeyDown, true);
      return () => document.removeEventListener("keydown", handleKeyDown, true);
   }, [selectedIndex, currentItems.length, navigateMedia]);

   useEffect(() => {
      if (selectedIndex !== null) {
         carouselApi?.scrollTo(selectedIndex);
      }
   }, [carouselApi, selectedIndex]);

   if (backdrops.length === 0 && posters.length === 0 && videos.length === 0) {
      return null;
   }

   return (
      <div
         id="gallery"
         className="w-full space-y-3"
      >
         <ContentTitle
            title={title}
            subtitle={subtitle}
         />
         <Tabs
            value={activeTab}
            onValueChange={(val) => setSelectedTab(val as MediaTab)}
            className="w-full mb-5"
         >
            <div className="w-full">
               <TabsList className="flex w-full max-w-full flex-nowrap justify-start overflow-x-auto overflow-y-hidden overscroll-x-contain pb-2! sm:w-fit sm:overflow-x-visible sm:pb-0! bg-transparent p-0 h-auto gap-2 rounded-none">
                  {backdrops.length > 0 && (
                     <TabsTrigger
                        value="backdrops"
                        style={{
                           backgroundColor:
                              activeTab === "backdrops" ? "#ffffff" : undefined,
                           color:
                              activeTab === "backdrops" ? "#000000" : undefined,
                        }}
                        className="flex-none shrink-0 whitespace-nowrap flex items-center gap-2 text-xs uppercase tracking-widest px-1 sm:px-3! py-2! rounded-none text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 data-[state=active]:bg-white! data-[state=active]:text-black! font-semibold transition-colors cursor-pointer shadow-none border-0"
                     >
                        <ImageIcon className="w-3.5 h-3.5" />
                        {t("backdrops")} ({backdrops.length})
                     </TabsTrigger>
                  )}

                  {posters.length > 0 && (
                     <TabsTrigger
                        value="posters"
                        style={{
                           backgroundColor:
                              activeTab === "posters" ? "#ffffff" : undefined,
                           color:
                              activeTab === "posters" ? "#000000" : undefined,
                        }}
                        className="flex-none shrink-0 whitespace-nowrap flex items-center gap-2 text-xs uppercase tracking-widest px-1 sm:px-3! py-2! rounded-none text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 data-[state=active]:bg-white! data-[state=active]:text-black! font-semibold transition-colors cursor-pointer shadow-none border-0"
                     >
                        <IdCardIcon className="w-3.5 h-3.5" />
                        {t("posters")} ({posters.length})
                     </TabsTrigger>
                  )}

                  {videos.length > 0 && (
                     <TabsTrigger
                        value="videos"
                        style={{
                           backgroundColor:
                              activeTab === "videos" ? "#ffffff" : undefined,
                           color:
                              activeTab === "videos" ? "#000000" : undefined,
                        }}
                        className="flex-none shrink-0 whitespace-nowrap flex items-center gap-2 text-xs uppercase tracking-widest px-1 sm:px-3! py-2! rounded-none text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 data-[state=active]:bg-white! data-[state=active]:text-black! font-semibold transition-colors cursor-pointer shadow-none border-0"
                     >
                        <Film className="w-3.5 h-3.5" />
                        {t("videos")} ({videos.length})
                     </TabsTrigger>
                  )}
               </TabsList>
            </div>
         </Tabs>
         <Carousel
            opts={{ align: "start", loop: true, watchDrag: true }}
            className="w-full relative"
            plugins={[wheelPlugin]}
            setApi={setCarouselApi}
            key={activeTab}
         >
            <CarouselContent className="-ml-3">
               {activeTab === "backdrops" &&
                  backdrops.map((path, index) => (
                     <CarouselItem
                        key={`backdrop-${path}-${index}`}
                        className="pl-0 basis-full sm:basis-1/2 md:basis-1/3"
                     >
                        <button
                           type="button"
                           onClick={() => setSelectedIndex(index)}
                           aria-label={t("viewBackdrop", { number: index + 1 })}
                           className="group relative block aspect-video w-full overflow-hidden border border-zinc-800/60 bg-zinc-950 shadow-lg cursor-pointer select-none"
                        >
                           <TmdbImage
                              src={path}
                              alt={`Backdrop ${index + 1}`}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                           />
                           <div className="absolute inset-0 bg-zinc-950 z-10 opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex items-center justify-center">
                              <Maximize2 className="z-20 w-6 h-6 text-white" />
                           </div>
                        </button>
                     </CarouselItem>
                  ))}

               {activeTab === "posters" &&
                  posters.map((path, index) => (
                     <CarouselItem
                        key={`poster-${path}-${index}`}
                        className="pl-0 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/7"
                     >
                        <button
                           type="button"
                           onClick={() => setSelectedIndex(index)}
                           aria-label={t("viewPoster", { number: index + 1 })}
                           className="group relative block aspect-2/3 w-full overflow-hidden border border-zinc-800/60 bg-zinc-950 shadow-lg cursor-pointer select-none"
                        >
                           <TmdbImage
                              src={path}
                              alt={`Poster ${index + 1}`}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                           />
                           <div className="absolute inset-0 bg-zinc-950/40 z-20 opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-center justify-center">
                              <Maximize2 className="z-20 w-6 h-6 text-white" />
                           </div>
                        </button>
                     </CarouselItem>
                  ))}
               {activeTab === "videos" &&
                  videos.map((video, index) => (
                     <CarouselItem
                        key={`video-${video.id}`}
                        className="pl-0 basis-full sm:basis-1/2 md:basis-1/3"
                     >
                        <button
                           type="button"
                           onClick={() => setSelectedIndex(index)}
                           aria-label={t("playVideo", { name: video.name })}
                           className="group relative flex aspect-video w-full items-center justify-center overflow-hidden border border-zinc-800/60 bg-zinc-950 shadow-lg cursor-pointer select-none"
                        >
                           <div
                              className="absolute inset-0 bg-cover bg-center opacity-70 transition-transform duration-500 group-hover:scale-105"
                              style={{
                                 backgroundImage: `url(https://img.youtube.com/vi/${encodeURIComponent(video.key)}/hqdefault.jpg)`,
                              }}
                           />
                           <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/50" />
                           <Play className="relative z-10 h-10 w-10 fill-white text-white" />
                        </button>
                     </CarouselItem>
                  ))}
            </CarouselContent>

            <div className="flex justify-end gap-2 mt-4">
               <CarouselPrevious className="static translate-y-0 rounded-xs bg-zinc-900/90 hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:text-white cursor-pointer w-9 h-9" />
               <CarouselNext className="static translate-y-0 rounded-xs bg-zinc-900/90 hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:text-white cursor-pointer w-9 h-9" />
            </div>
         </Carousel>

         <GalleryModal
            selectedMedia={selectedMedia}
            activeTab={activeTab}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            videos={videos}
            currentItems={currentItems}
            navigateMedia={navigateMedia}
         />
      </div>
   );
}
