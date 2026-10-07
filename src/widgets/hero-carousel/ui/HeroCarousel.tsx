// widgets/hero-carousel/ui/HeroCarousel.tsx
"use client";

import { useState, useEffect } from "react";
import { BaseMedia } from "@/entities/media";
import { CarouselNavigation } from "./CarouselNavigation";
import { HeroSlideContent } from "./HeroSlideContent";

interface HeroCarouselProps {
   media: BaseMedia[];
}

const SLIDER_TIME = 100000;

export function HeroCarousel({ media }: HeroCarouselProps) {
   const [currentSlide, setCurrentSlide] = useState(0);

   // Reset auto-play timer on manual slide change
   useEffect(() => {
      if (!media || media.length <= 1) return;

      const timer = setInterval(() => {
         setCurrentSlide((prev) => (prev + 1) % media.length);
      }, SLIDER_TIME);

      return () => clearInterval(timer);
   }, [media, currentSlide]);

   if (!media || media.length === 0) return null;

   const currentMedia = media[currentSlide];

   return (
      <div className="flex-1 min-h-[calc(100svh-55px)] sm:min-h-screen relative flex flex-col justify-end bg-black lg:bg-[#010101]">
         <HeroSlideContent
            key={currentMedia.id}
            media={currentMedia}
         >
            <CarouselNavigation
               media={media}
               sliderTime={SLIDER_TIME}
               currentSlide={currentSlide}
               setCurrentSlide={setCurrentSlide}
            />
         </HeroSlideContent>
      </div>
   );
}
