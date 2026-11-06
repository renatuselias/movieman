"use client";

import { Link } from "@/app/i18n/navigation";
import { TmdbPersonDetail } from "@/entities/person/model/types";
import { Skeleton } from "@/shared/ui/skeleton";
import { TmdbImage } from "@/shared/ui/TmdbImage";

interface ProfileProps {
   personDetails?: TmdbPersonDetail | null;
   isLoading: boolean;
   character: string | null;
}

export function Profile({ personDetails, isLoading, character }: ProfileProps) {
   return (
      <div className="group md:col-span-4 lg:col-span-3 space-y-3">
         <div className="relative aspect-2/3 w-full max-w-50 sm:max-w-96 rounded-none overflow-hidden bg-neutral-900 border border-neutral-800">
            {personDetails?.profile_path && !isLoading ? (
               <>
                  <Skeleton className="absolute inset-0 w-full h-full z-0" />

                  <Link href={`/person/${personDetails?.id}`}>
                     <TmdbImage
                        src={personDetails.profile_path}
                        alt={personDetails.name || "Person"}
                        fill
                        fadeDuration={900}
                        sizes="(max-width: 768px) 240px, 300px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                     />
                  </Link>
               </>
            ) : isLoading ? (
               <Skeleton className="w-full h-full" />
            ) : (
               <div className="w-full h-full flex items-center justify-center text-xs text-neutral-500 uppercase tracking-widest">
                  No Photo
               </div>
            )}
         </div>

         <div className="w-fit">
            <Link href={`/person/${personDetails?.id}`}>
               <h3 className="w-fit text-lg font-medium italic text-white leading-snug">
                  {personDetails?.name || "Person"}
               </h3>
            </Link>

            {character && (
               <p className="text-xs uppercase tracking-wider text-neutral-500 mt-0.5">
                  {character}
               </p>
            )}
         </div>
      </div>
   );
}
