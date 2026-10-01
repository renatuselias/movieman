import { BaseMedia } from "@/entities/media";
import { HeroCarousel } from "@/widgets/hero-carousel";

export async function MainPage({ media }: { media: BaseMedia[] }) {
   return (
      <div>
         <HeroCarousel media={media} />
         <div className="mt-20 px-4 sm:px-16 m-auto flex flex-col gap-20 sm:gap-40">
            Hellow
         </div>
      </div>
   );
}
