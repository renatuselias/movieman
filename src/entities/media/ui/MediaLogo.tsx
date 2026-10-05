import { useTmdbImagePath } from "@/shared/lib/hooks/useTmdbImagePath";
import { TmdbSize } from "@/shared/types/media-types";
import { Skeleton } from "@/shared/ui/skeleton";
import { TmdbImage } from "@/shared/ui/TmdbImage";
import { useState } from "react";

interface MediaLogoProps {
   logoPath: string;
   title: string;
   isDarkLogo: boolean;
}

export function MediaLogo({ logoPath, title, isDarkLogo }: MediaLogoProps) {
   const [imageState, setImageState] = useState<"loading" | "loaded" | "error">(
      "loading",
   );

   const logoUrl = useTmdbImagePath("logo");
   const tmdbSize: TmdbSize = logoUrl.includes("w185") ? "w185" : "w500";

   if (imageState === "error") {
      return (
         <div className="mb-3 sm:mb-6 lg:mb-8">
            <h1 className="inline text-3xl sm:text-5xl bg-linear-to-r from-zinc-100 via-zinc-400 to-zinc-600 bg-clip-text animate-shimmer font-bold text-white leading-tight">
               {title}
            </h1>
         </div>
      );
   }

   return (
      <div className="relative inline-block ">
         {imageState === "loading" && (
            <Skeleton className="absolute bottom-0 left-0 h-12 animate-none sm:h-16 w-60 md:h-20 sm:w-80" />
         )}
         <TmdbImage
            src={logoPath}
            alt={title || "Media title"}
            tmdbSize={tmdbSize}
            width={280}
            height={240}
            fadeDuration={300}
            fetchPriority="high"
            onLoad={() => setImageState("loaded")}
            onError={() => setImageState("error")}
            className={`${isDarkLogo ? "brightness-200 invert" : ""} origin-bottom-left select-none object-contain drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] h-auto max-[500px]:w-40 w-60 md:w-80`}
         />
      </div>
   );
}
