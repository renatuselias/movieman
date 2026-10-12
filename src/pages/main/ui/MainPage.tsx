import { BaseMedia } from "@/entities/media";
import { HeroCarousel } from "@/widgets/hero-carousel";
import { MediaGrid } from "@/widgets/media-grid";

export async function MainPage({ media }: { media: BaseMedia[] }) {
   return (
      <>
         <HeroCarousel media={media} />
         <div className="w-full px-4 sm:px-8 mt-60">
            <MediaGrid
               mediaType="movie"
               title="Trending"
               subtitle="Subtitle"
            />
         </div>
      </>
   );
}
