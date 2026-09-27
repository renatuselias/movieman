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
      <div className="flex w-full justify-center sm:justify-end items-center gap-3">
         {media.map((m, i) => {
            const active = i === currentSlide;
            return (
               <button
                  key={m.id}
                  onClick={() => setCurrentSlide(i)}
                  aria-label={m.title}
                  className="group select-none flex-1 sm:flex-0 flex flex-col items-center gap-1 py-2 sm:py-0"
               >
                  <span
                     className={cn(
                        "hidden sm:block font-space text-sm font-medium tabular-nums tracking-tighter transition-colors duration-300",
                        active
                           ? "text-white"
                           : "text-neutral-500 group-hover:text-neutral-300",
                     )}
                  >
                     {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="relative h-[1.5px] w-full sm:w-4 overflow-hidden rounded-full bg-white/15">
                     {active && (
                        <span
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
