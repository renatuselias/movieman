import { BaseMedia } from "@/entities/media";
import { cn } from "@/shared/lib/utils";

interface CarouselNavigationProps {
   media: BaseMedia[];
   currentSlide: number;
   setCurrentSlide: (value: number) => void;
   sliderTime: number;
}

export function CarouselNavigation({
   media,
   currentSlide,
   setCurrentSlide,
   sliderTime,
}: CarouselNavigationProps) {
   return (
      <div className="flex w-full justify-center sm:justify-end items-center gap-5 tracking-tighter text-sm">
         {media.map((m, i) => {
            const active = i === currentSlide;
            const slideNumber = String(i + 1).padStart(2, "0");

            return (
               <button
                  key={m.id}
                  onClick={() => setCurrentSlide(i)}
                  aria-label={m.title}
                  aria-current={active ? "true" : undefined}
                  className="group select-none flex-1 sm:flex-initial flex flex-col items-center gap-1 py-2 sm:py-0 cursor-pointer"
               >
                  {/* Slide number for desktop */}
                  <span
                     className={cn(
                        "hidden sm:block tabular-nums transition-colors duration-300",
                        active
                           ? "text-white"
                           : "text-neutral-500 group-hover:text-neutral-300",
                     )}
                  >
                     {slideNumber}
                  </span>

                  {/* Progress bar container */}
                  <span className="relative h-[1.5px] w-full sm:w-4 overflow-hidden rounded-full bg-white/15">
                     {active && (
                        <span
                           key={`progress-${m.id}-${currentSlide}`}
                           className="absolute inset-0 rounded-full bg-white"
                           style={{
                              animation: `progressScaleX ${sliderTime}ms linear forwards`,
                              transformOrigin: "left",
                           }}
                        />
                     )}
                  </span>
               </button>
            );
         })}
      </div>
   );
}
