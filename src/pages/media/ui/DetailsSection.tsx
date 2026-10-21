import { CrewMember, getMainCreators, MediaFullInfo } from "@/entities/media";
import { PersonDetailItem } from "./PersonDetail";
import { TextDetailItem } from "./TextDetail";
import { MediaType } from "@/shared/types/media-types";
import { formatDate } from "@/shared/lib/format/format-date";
import { useLocale, useTranslations } from "next-intl";

interface DetailsSectionProps {
   extraMedia: MediaFullInfo | null | undefined;
   mediaType: MediaType;
}

export function DetailsSection({ extraMedia, mediaType }: DetailsSectionProps) {
   const locale = useLocale();
   const t = useTranslations("media");

   function getFeaturedCrew(crew: CrewMember[]) {
      const targetJobs = [
         "Director",
         "Screenplay",
         "Writer",
         "Original Music Composer",
         "Director of Photography",
      ];

      return crew.filter((member) => targetJobs.includes(member.job));
   }

   const mediaCrew = getFeaturedCrew(extraMedia?.crew || []);

   const writers = mediaCrew.filter((member) =>
      ["Screenplay", "Writer"].includes(member.job),
   );

   const musicComposers = mediaCrew.filter((member) =>
      ["Original Music Composer"].includes(member.job),
   );

   const directors =
      mediaType === "movie"
         ? getMainCreators(extraMedia?.crew)
         : (extraMedia?.createdBy ?? []);

   const photography = mediaCrew.filter((member) =>
      ["Director of Photography"].includes(member.job),
   );

   return (
      <div className="w-full flex gap-5 sm:gap-10 md:gap-20 flex-wrap md:flex-nowrap justify-between items-start">
         <div className="flex flex-col gap-2 text-sm w-full md:w-fit min-w-0">
            <h3 className="text-base text-zinc-400">{t("moreContext")}</h3>
            <h2 className="w-fit text-3xl text-zinc-100 text-wrap font-medium">
               {t("menu.details")}.
            </h2>
         </div>

         <div className="flex flex-col gap-4 w-full md:w-6/9 min-w-0">
            <div className="grid grid-cols-2 gap-x-8 sm:gap-x-12 gap-y-6">
               <PersonDetailItem
                  title={t("mediaDetails.creators")}
                  items={directors}
               />
               <PersonDetailItem
                  title={t("mediaDetails.screenplay")}
                  items={writers}
               />
               <PersonDetailItem
                  title={t("mediaDetails.music")}
                  items={musicComposers}
               />
               <PersonDetailItem
                  title={t("mediaDetails.cinematography")}
                  items={photography}
               />

               {mediaType === "movie" && (
                  <TextDetailItem title={t("mediaDetails.releaseDate")}>
                     {formatDate(
                        extraMedia?.releaseDate || null,
                        "full",
                        locale,
                     )}
                  </TextDetailItem>
               )}

               <TextDetailItem title={t("mediaDetails.originalTitle")}>
                  {extraMedia?.originalTitle}
               </TextDetailItem>

               {mediaType === "tv" && (
                  <>
                     <TextDetailItem title={t("mediaDetails.seriesFormat")}>
                        {extraMedia?.type}
                     </TextDetailItem>
                     <TextDetailItem title={t("mediaDetails.firstAired")}>
                        {formatDate(
                           extraMedia?.releaseDate || null,
                           "full",
                           locale,
                        )}
                     </TextDetailItem>
                     {extraMedia?.status === "Returning Series" &&
                     extraMedia.nextEpisode ? (
                        <TextDetailItem title={t("mediaDetails.nextEpisode")}>
                           {`"${extraMedia?.nextEpisode?.name}" – ${formatDate(extraMedia?.nextEpisode?.air_date || null, "full", locale)}`}
                        </TextDetailItem>
                     ) : (
                        <TextDetailItem title={t("mediaDetails.latestEpisode")}>
                           {`S${extraMedia?.lastEpisode?.season_number} · Ep${extraMedia?.lastEpisode?.episode_number} – "${extraMedia?.lastEpisode?.name}"`}
                        </TextDetailItem>
                     )}
                     <TextDetailItem title={t("mediaDetails.numberOfSeasons")}>
                        {extraMedia?.numberOfSeasons}
                     </TextDetailItem>
                     <TextDetailItem title={t("mediaDetails.numberOfEpisodes")}>
                        {extraMedia?.numberOfEpisodes}
                     </TextDetailItem>
                  </>
               )}

               <TextDetailItem title={t("mediaDetails.countries")}>
                  {extraMedia?.productionCountries.map((item) => item.name)}
               </TextDetailItem>

               {mediaType === "tv" && (
                  <TextDetailItem title={t("mediaDetails.networks")}>
                     {extraMedia?.networks?.map((item) => item.name)}
                  </TextDetailItem>
               )}

               <TextDetailItem title={t("mediaDetails.production")}>
                  {extraMedia?.productionCompanies
                     .map((item) => item.name)
                     .join(" / ")}
               </TextDetailItem>

               {mediaType === "movie" && (
                  <>
                     <TextDetailItem title={t("mediaDetails.budget")}>
                        {extraMedia?.budget}
                     </TextDetailItem>
                     <TextDetailItem title={t("mediaDetails.revenue")}>
                        {extraMedia?.revenue}
                     </TextDetailItem>
                  </>
               )}

               {extraMedia?.status && (
                  <TextDetailItem title={t("mediaDetails.status")}>
                     {t(`status.${extraMedia.status}`)}
                  </TextDetailItem>
               )}
            </div>
         </div>
      </div>
   );
}
