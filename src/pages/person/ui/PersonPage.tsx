"use client";

import { Link } from "@/app/i18n/navigation";
import { mapToBaseMedia, MediaCarousel } from "@/entities/media";
import {
   Biography,
   combinePersonCredits,
   getPersonMainWorks,
   Stats,
} from "@/entities/person";
import { useGetPersonDetails } from "@/entities/person/model/use-get-person-details";
import { getSocialLinks } from "@/shared/lib/get-social-links";

import { ContentTitle } from "@/shared/ui/ContentTitle";
import { Skeleton } from "@/shared/ui/skeleton";
import { TmdbImage } from "@/shared/ui/TmdbImage";
import { GallerySkeleton, MediaGallery } from "@/widgets/media-gallery";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Filmography } from "./Filmography";
import { useMemo } from "react";

export function PersonPage({ personId }: { personId: number }) {
   const t = useTranslations();
   const locale = useLocale();

   const { data: personDetails, isLoading } = useGetPersonDetails(
      personId,
      locale,
   );

   const { combined_credits } = personDetails || {};
   const { cast = [], crew = [] } = combined_credits || {};

   const mainArt = getPersonMainWorks(personDetails).map((item) =>
      mapToBaseMedia(item),
   );

   const combinedCredits = combinePersonCredits(cast, crew);

   const totalCredits = combinedCredits.length;

   const socialList = getSocialLinks(personDetails?.external_ids);

   const hasGallery =
      isLoading ||
      (personDetails?.images?.profiles.length &&
         personDetails?.images?.profiles.length > 1);

   const navList = useMemo(() => {
      return [
         {
            id: "gallery",
            text: "media.menu.gallery",
            href: "#gallery",
            show: hasGallery,
         },
         {
            id: "selected-works",
            text: "person.selectedWorks",
            href: "#selected-works",
            show: true,
         },
         {
            id: "filmography",
            text: "person.filmography",
            href: "#filmography",
            show: true,
         },
      ].filter((item) => item.show);
   }, [hasGallery]);

   return (
      <div className="relative w-full">
         <div className="absolute top-0 z-0 left-0 aspect-16/8 w-full pt-20">
            <TmdbImage
               src={mainArt[0]?.backdropPath}
               alt={mainArt[0]?.posterPath || ""}
               fill
               fadeDuration={900}
               sizes="(max-width: 768px) 240px, 300px"
               className="object-cover"
            />
            <div className="absolute w-full -bottom-0.5 h-14 bg-linear-to-t from-black via-black/70 via-10% to-transparent z-20 pointer-events-none transform-gpu" />
            <div className="absolute top-0 left-0 z-10 bg-zinc-950/90 h-full w-full" />
         </div>

         <div className="relative custom-container aspect-16/8 flex flex-col items-start md:flex-row md:justify-between md:items-end pt-20">
            <div className="mb-10 lg:mb-40 max-w-full md:max-w-1/2 z-10">
               <h2 className="uppercase text-zinc-400">
                  {t("person.inTheSpotlight")}
                  {personDetails?.known_for_department && (
                     <>
                        {" "}
                        / {t(`person.${personDetails?.known_for_department}`)}
                     </>
                  )}
               </h2>
               <h1 className="text-4xl sm:text-8xl font-black tracking-wide wrap-break-word">
                  {personDetails?.name}
               </h1>
            </div>

            <div className="relative w-3/4 md:w-1/3 aspect-2/3 mask-[linear-gradient(0deg,transparent,black_18%,black_90%,transparent),linear-gradient(90deg,transparent,black_12%,black_90%,transparent)] mask-intersect">
               <TmdbImage
                  src={personDetails?.profile_path}
                  alt={personDetails?.name || "Person profile"}
                  fill
                  fadeDuration={900}
                  sizes="(max-width: 768px) 240px, 300px"
                  className="object-cover"
               />
            </div>
         </div>

         <div className="mt-10 relative z-10 w-full custom-container space-y-10 sm:space-y-20">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
               <div className="space-y-6 col-span-8 md:col-span-6">
                  <ContentTitle
                     title={t("person.behindTheScreen")}
                     subtitle={t("person.closerLook")}
                  />
                  <Stats
                     personDetails={personDetails}
                     totalCredits={totalCredits}
                     isLoading={isLoading}
                     isPersonPage={true}
                  />
                  {isLoading ? (
                     <div className="space-y-4">
                        <Skeleton className="w-1/4 h-6" />
                        <Skeleton className="w-1/2 h-6" />
                     </div>
                  ) : (
                     <ul className="flex gap-2 flex-wrap">
                        {socialList.map((item) => (
                           <li key={item.href}>
                              <Link
                                 className="px-0! py-0! h-fit! rounded-none! bg-transparent! cursor-pointer group/link flex w-fit items-center gap-1 font-manrope text-md text-white/70 underline underline-offset-4 decoration-white/30 transition-colors hover:text-white hover:decoration-white/60"
                                 href={item.href}
                              >
                                 {item.label}
                                 <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                              </Link>
                           </li>
                        ))}
                     </ul>
                  )}
               </div>

               <Biography
                  biography={personDetails?.biography}
                  isLoading={isLoading}
                  personId={personDetails?.id}
                  isPersonPage={true}
               />
            </div>

            {/* Navigation */}
            {navList.length > 1 && (
               <div className="w-full border-t border-b py-6">
                  {isLoading ? (
                     <div className="flex gap-3">
                        <Skeleton className="w-20 h-4" />
                        <Skeleton className="w-20 h-4" />
                        <Skeleton className="w-20 h-4" />
                     </div>
                  ) : (
                     <nav>
                        <ul className="flex flex-wrap gap-4 items-center text-xs">
                           {navList.map((item, index) => (
                              <li key={item.id}>
                                 <a
                                    href={item.href}
                                    className="inline-block hover:opacity-80 transition-opacity cursor-pointer"
                                 >
                                    <h2>
                                       {String(index + 1).padStart(2, "0")}{" "}
                                       <span className="text-zinc-300 sm:ml-1">
                                          {t(`${item.text}`)}
                                       </span>
                                    </h2>
                                 </a>
                              </li>
                           ))}
                        </ul>
                     </nav>
                  )}
               </div>
            )}

            {isLoading ? (
               <GallerySkeleton isPersonPage={true} />
            ) : (
               hasGallery && (
                  <MediaGallery
                     title={t("person.inFocus")}
                     subtitle={t("person.throughTheLens")}
                     posters={personDetails?.images?.profiles.map(
                        (item) => item.file_path,
                     )}
                     isPersonPage={true}
                  />
               )
            )}

            {/* Known for */}
            <MediaCarousel
               title={t("person.selectedWorks")}
               subtitle={t("person.goodPlaceToStart")}
               medias={mainArt}
               isLoading={isLoading}
               id={"selected-works"}
            />

            {/* Filmography */}
            <Filmography
               isLoading={isLoading}
               medias={combinedCredits}
            />
         </div>
      </div>
   );
}
