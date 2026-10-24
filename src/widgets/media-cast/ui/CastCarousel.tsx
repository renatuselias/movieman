"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { User } from "lucide-react";
import {
   Carousel,
   CarouselContent,
   CarouselItem,
   CarouselNext,
   CarouselPrevious,
} from "@/shared/ui/carousel";
import { Skeleton } from "@/shared/ui/skeleton";
import { TmdbImage } from "@/shared/ui/TmdbImage";
import { CastMember } from "@/entities/media";
import { useTranslations } from "next-intl";

export function CastCarousel({
   cast,
   isLoading,
}: {
   cast: CastMember[];
   isLoading: boolean;
}) {
   const t = useTranslations("media.mediaDetails");

   const wheelPlugin = useMemo(
      () => WheelGesturesPlugin({ forceWheelAxis: "x" }),
      [],
   );

   return (
      <div className="w-full pt-20">
         <Carousel
            opts={{
               align: "start",
               loop: true,
               watchDrag: true,
            }}
            className="w-full relative"
            plugins={[wheelPlugin]}
         >
            <CarouselContent className="-ml-3">
               {isLoading
                  ? Array.from({ length: 6 }).map((_, index) => (
                       <CarouselItem
                          key={`skeleton-${index}`}
                          className="pl-1 sm:pl-3 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
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
                  : cast.map((actor) => {
                       return (
                          <CarouselItem
                             key={`${actor.id}-${actor.character || actor.profilePath}`}
                             className="pl-1 sm:pl-3 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
                          >
                             <Link
                                href={`/person/${actor.id}`}
                                prefetch={false}
                                className="block h-full"
                             >
                                <motion.div
                                   whileHover={{ y: -4 }}
                                   transition={{ duration: 0.2 }}
                                   className="group relative flex flex-col h-full rounded-none transition-colors duration-300 overflow-hidden shadow-lg select-none"
                                >
                                   {/* Poster image container */}
                                   <div className="relative aspect-2/3 w-full overflow-hidden">
                                      <Skeleton className="absolute inset-0 h-full w-full rounded-none! border border-zinc-700/30 z-0" />

                                      {actor.profilePath ? (
                                         <TmdbImage
                                            src={actor.profilePath}
                                            alt={actor.name || "Actor"}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                         />
                                      ) : (
                                         <div className="relative w-full h-full bg-zinc-950 z-10 flex flex-col items-center justify-center gap-2 font-mono text-xs text-zinc-600 ">
                                            <User className="w-8 h-8 text-zinc-700 stroke-[1.5]" />
                                            <span className="text-[10px] tracking-widest uppercase">
                                               {actor.name || "Unknown"}
                                            </span>
                                         </div>
                                      )}

                                      {/* Gradient overlay */}
                                      <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                                   </div>

                                   {/* Metadata block */}
                                   <div className="p-3 flex flex-col justify-between grow gap-1.5 z-10 border-t border-zinc-800/60">
                                      <h4 className="text-sm text-zinc-100 group-hover:text-zinc-400 transition-colors line-clamp-1 leading-snug">
                                         {actor.name}
                                      </h4>

                                      {actor.character && (
                                         <div className="flex items-center gap-1.5">
                                            <p className="text-[11px] text-zinc-400 line-clamp-1 leading-tight">
                                               {actor.character}
                                            </p>
                                         </div>
                                      )}
                                   </div>
                                </motion.div>
                             </Link>
                          </CarouselItem>
                       );
                    })}
            </CarouselContent>

            {/* Carousel navigation controls */}
            <div className="flex w-full justify-between items-center absolute -top-16">
               <h4 className="text-lg uppercase">{t("fullCast")}</h4>
               <div className="flex gap-2">
                  <CarouselPrevious className="static translate-y-0 rounded-xs bg-zinc-900/90 hover:bg-zinc-800 border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white cursor-pointer max-[380px]:w-8 max-[380px]:h-8 w-10 h-10 transition-all" />
                  <CarouselNext className="static translate-y-0 rounded-xs bg-zinc-900/90 hover:bg-zinc-800 border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white cursor-pointer max-[380px]:w-8 max-[380px]:h-8 w-10 h-10 transition-all" />
               </div>
            </div>
         </Carousel>
      </div>
   );
}
