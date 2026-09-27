"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface BackgroundImageProps {
   src: string | null;
   alt: string;
   imageKey?: string | number;
   loadingText?: string;
   aspectRatio?: string;
}

const globalLoadedImages = new Set<string>();

export function BackgroundImage({
   src,
   alt,
   imageKey,
   loadingText = "Loading...",
   aspectRatio,
}: BackgroundImageProps) {
   const t = useTranslations();

   const isSrc = Boolean(src && !src.includes("null"));
   const validSrc = isSrc ? (src as string) : null;

   const [prevSrc, setPrevSrc] = useState(src);
   const [isLoading, setIsLoading] = useState(() =>
      validSrc ? !globalLoadedImages.has(validSrc) : false,
   );

   if (prevSrc !== src) {
      setPrevSrc(src);
      setIsLoading(validSrc ? !globalLoadedImages.has(validSrc) : false);
   }

   const handleImageLoad = () => {
      if (validSrc) {
         globalLoadedImages.add(validSrc);
      }
      setIsLoading(false);
   };

   const containerClasses = aspectRatio
      ? `relative w-full overflow-hidden select-none shrink-0 bg-black`
      : `absolute inset-0 bg-black overflow-hidden pointer-events-none z-0`;

   return (
      <div
         className={containerClasses}
         style={aspectRatio ? { aspectRatio } : undefined}
      >
         <div className="relative h-full w-full isolate transform-gpu">
            {/* Minimal Loader */}
            <AnimatePresence mode="wait">
               {isLoading && validSrc && (
                  <motion.div
                     key={`loader-${validSrc}`}
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     transition={{ duration: 0.3 }}
                     className="absolute inset-0 bg-black/90 overflow-hidden z-30 flex items-center justify-center"
                  >
                     <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

                     <div className="relative flex flex-col items-center gap-3">
                        <div className="h-0.5 w-16 overflow-hidden rounded-full bg-white/10">
                           <motion.div
                              className="h-full bg-white/80"
                              initial={{ x: "-100%" }}
                              animate={{ x: "100%" }}
                              transition={{
                                 repeat: Infinity,
                                 duration: 1.2,
                                 ease: "easeInOut",
                              }}
                           />
                        </div>
                        <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/50 animate-pulse">
                           {loadingText}
                        </span>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>

            {/* Animation from Top-Right */}
            <AnimatePresence mode="sync">
               <motion.div
                  key={imageKey || validSrc || "no-src"}
                  style={{ transformOrigin: "top right" }}
                  initial={{
                     opacity: 0,
                     scale: 1.15,
                     x: 40,
                     y: -30,
                     filter: "blur(6px)",
                  }}
                  animate={{
                     opacity: 1,
                     scale: 1,
                     x: 0,
                     y: 0,
                     filter: "blur(0px)",
                  }}
                  exit={{
                     opacity: 0,
                     scale: 1.05,
                     x: 20,
                     y: -15,
                     filter: "blur(4px)",
                  }}
                  transition={{
                     duration: 1.1,
                     ease: [0.16, 1, 0.3, 1],
                  }}
                  className="absolute inset-0 z-0 transform-gpu backface-hidden"
               >
                  {validSrc ? (
                     <Image
                        src={validSrc}
                        alt={alt}
                        fill
                        priority={true}
                        quality={90}
                        className="object-cover select-none object-top"
                        sizes={
                           aspectRatio
                              ? "(max-width: 640px) 92vw, 50vw"
                              : "100vw"
                        }
                        draggable={false}
                        onLoad={handleImageLoad}
                     />
                  ) : (
                     <div className="absolute inset-0 flex items-center justify-center text-white/60 text-xl tracking-widest select-none font-bold bg-black/70">
                        {t("common.noBackground")}
                     </div>
                  )}
               </motion.div>
            </AnimatePresence>

            {/* Gradients Overlay */}
            <div className="absolute inset-0 bg-linear-to-l from-black/60 via-transparent to-transparent z-20 pointer-events-none" />
            <div className="hidden sm:block absolute inset-x-0 -bottom-0.5 h-[calc(75%+2px)] bg-linear-to-t from-black via-black/90 via-30% to-transparent z-20 pointer-events-none scale-[1.01] transform-gpu" />
            <div className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-transparent z-20 pointer-events-none" />
         </div>
      </div>
   );
}
