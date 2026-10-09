// widgets/hero-carousel/ui/HeroCarousel.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { BaseMedia } from "@/entities/media";
import { CarouselNavigation } from "./CarouselNavigation";
import { HeroSlideContent } from "./HeroSlideContent";

interface HeroCarouselProps {
   media: BaseMedia[];
}

const SLIDER_TIME = 20000;

export function HeroCarousel({ media }: HeroCarouselProps) {
   const [currentSlide, setCurrentSlide] = useState(0);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const remainingTime = useRef(SLIDER_TIME);
   const startedAt = useRef<number | null>(null);
   const previousSlide = useRef(currentSlide);

   useEffect(() => {
      if (previousSlide.current !== currentSlide) {
         previousSlide.current = currentSlide;
         remainingTime.current = SLIDER_TIME;
      }

      if (media.length <= 1 || isModalOpen) return;

      startedAt.current = performance.now();
      const timer = setTimeout(() => {
         startedAt.current = null;
         remainingTime.current = SLIDER_TIME;
         setCurrentSlide((prev) => (prev + 1) % media.length);
      }, remainingTime.current);

      return () => {
         clearTimeout(timer);
         if (startedAt.current !== null) {
            remainingTime.current = Math.max(
               0,
               remainingTime.current - (performance.now() - startedAt.current),
            );
            startedAt.current = null;
         }
      };
   }, [media.length, currentSlide, isModalOpen]);

   if (!media || media.length === 0) return null;

   const currentMedia = media[currentSlide];

   return (
      <div className="flex-1 min-h-[calc(100svh-55px)] sm:min-h-screen relative flex flex-col justify-end bg-black lg:bg-[#010101]">
         <HeroSlideContent
            key={currentMedia.id}
            media={currentMedia}
            isModalOpen={isModalOpen}
            onModalOpenChange={setIsModalOpen}
         >
            <CarouselNavigation
               media={media}
               sliderTime={SLIDER_TIME}
               currentSlide={currentSlide}
               setCurrentSlide={setCurrentSlide}
               isPaused={isModalOpen}
            />
         </HeroSlideContent>
      </div>
   );
}
