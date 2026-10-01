"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

   const [isLoaded, setIsLoaded] = useState(false);

   // Track previous src during render to detect changes
   const [prevSrc, setPrevSrc] = useState(validSrc);
   if (prevSrc !== validSrc) {
      setPrevSrc(validSrc);
      setIsLoaded(false); // Valid state update during render (no cascading effect render!)
   }

   const imageRef = useRef<HTMLImageElement>(null);

   // Check cached/already completed image on mount or src change
   useEffect(() => {
      if (!validSrc) return;

      const image = imageRef.current;
      if (!image) return;

      const expectedSrc = new URL(validSrc, window.location.href).href;
      const imageSrc = image.currentSrc || image.src;

      if (
         image.complete &&
         image.naturalWidth > 0 &&
         imageSrc === expectedSrc
      ) {
         setIsLoaded(true);
      }
   }, [validSrc]);

   const handleImageLoad = useCallback(() => {
      setIsLoaded(true);
   }, []);

   const containerClasses = aspectRatio
      ? "relative w-full overflow-hidden select-none shrink-0 bg-black"
      : "absolute inset-0 bg-black overflow-hidden pointer-events-none z-0";

   return (
      <div
         className={containerClasses}
         style={aspectRatio ? { aspectRatio } : undefined}
      >
         <div className="relative h-full w-full isolate transform-gpu">
            {/* Top-Right Entrance Animation */}
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
                        ref={imageRef}
                        src={validSrc}
                        alt={alt}
                        fill
                        priority
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

            {/* Background loader stays mounted until active image finishes loading */}
            <div
               role="status"
               aria-live="polite"
               aria-hidden={isLoaded || !validSrc}
               className={`absolute inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/90 transition-opacity duration-300 ${
                  !isLoaded && validSrc
                     ? "opacity-100"
                     : "pointer-events-none opacity-0"
               }`}
            >
               <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

               <div className="relative flex flex-col items-center gap-3">
                  <div className="h-0.5 w-16 overflow-hidden rounded-full bg-white/10">
                     <div className="background-loader-segment h-full w-8 bg-white/80" />
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/50 animate-pulse">
                     {loadingText}
                  </span>
               </div>
            </div>

            {/* Gradients Overlay */}
            <div className="absolute inset-0 bg-linear-to-l from-black/60 via-transparent to-transparent z-20 pointer-events-none" />
            <div className="hidden sm:block absolute inset-x-0 -bottom-0.5 h-[calc(75%+200px)] bg-linear-to-t from-black via-black/70 via-10% to-transparent z-20 pointer-events-none scale-[1.01] transform-gpu" />
            <div className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-transparent z-20 pointer-events-none" />
         </div>
      </div>
   );
}
