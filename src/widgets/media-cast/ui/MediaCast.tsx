import { CastCarousel } from "./CastCarousel";
import { Profile } from "./Profile";
import { useGetPersonDetails } from "@/entities/person/model/use-get-person-details";
import { Stats } from "./Stats";
import { Biography } from "./Biography";
import { CastMember } from "@/entities/media";
import { useTranslations } from "next-intl";
import { ContentTitle } from "@/shared/ui/ContentTitle";

export function MediaCast({
   mediaCast,
   mediaLoading,
}: {
   mediaCast: CastMember[];
   mediaLoading: boolean;
}) {
   const t = useTranslations("media");

   const [firstActor, ...remainingCast] = mediaCast;

   const { data: personDetails, isLoading } = useGetPersonDetails(
      firstActor?.id,
   );

   const { combined_credits } = personDetails || {};
   const { cast = [], crew = [] } = combined_credits || {};
   const totalCredits = cast.length + crew.length;

   return (
      <section
         id="cast"
         className="w-full space-y-4 "
      >
         <ContentTitle
            title={t("mediaDetails.cast")}
            subtitle={t("cast.topCast")}
         />
         <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 min-h-0">
            <Profile
               personDetails={personDetails}
               isLoading={isLoading}
               character={firstActor?.character}
            />

            <Stats
               personDetails={personDetails}
               totalCredits={totalCredits}
               isLoading={isLoading}
            />

            <Biography
               biography={personDetails?.biography}
               isLoading={isLoading}
               personId={personDetails?.id}
            />
         </div>

         <CastCarousel
            isLoading={mediaLoading}
            cast={remainingCast}
         />
      </section>
   );
}
