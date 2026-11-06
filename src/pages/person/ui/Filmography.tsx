import { BaseMedia, GenresList } from "@/entities/media";
import { formatDate } from "@/shared/lib/format/format-date";
import { Button } from "@/shared/ui/button";
import { ContentTitle } from "@/shared/ui/ContentTitle";
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue,
} from "@/shared/ui/select";
import { Skeleton } from "@/shared/ui/skeleton";
import { StarRating } from "@/shared/ui/StarRating";
import { TmdbImage } from "@/shared/ui/TmdbImage";
import { MediaModal } from "@/widgets/media-modal";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";

interface FilmographyProps {
   isLoading: boolean;
   medias: BaseMedia[];
}

export function Filmography({ isLoading, medias }: FilmographyProps) {
   const locale = useLocale();
   const t = useTranslations();
   const [selectedItem, setSelectedItem] = useState<BaseMedia | null>(null);
   const [sortBy, setSortBy] = useState<"releaseDate" | "rating">(
      "releaseDate",
   );
   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

   const handleCloseModal = useCallback(() => {
      setSelectedItem(null);
   }, []);

   const sortedMedias = useMemo(
      () =>
         [...medias].sort((a, b) => {
            const comparison =
               sortBy === "rating"
                  ? a.rating - b.rating
                  : (a.releaseDate ? new Date(a.releaseDate).getTime() : 0) -
                    (b.releaseDate ? new Date(b.releaseDate).getTime() : 0);

            return sortOrder === "desc" ? -comparison : comparison;
         }),
      [medias, sortBy, sortOrder],
   );

   return (
      <section className="w-full flex flex-col gap-5 sm:gap-10">
         <div className="flex gap-4 sm:gap-12 justify-between flex-wrap ">
            {isLoading ? (
               <div className="flex flex-col gap-4">
                  <Skeleton className="w-40 h-4" />
                  <Skeleton className="w-70 h-8" />
               </div>
            ) : (
               <ContentTitle
                  title={t("person.filmography")}
                  subtitle={t("person.completePicture")}
               />
            )}

            <div className="flex items-center gap-2 self-end text-sm text-gray-400 sm:self-auto">
               <span>{t("siteInterface.sortBy")}</span>
               <Select
                  value={sortBy}
                  onValueChange={(value) => {
                     if (value === "releaseDate" || value === "rating") {
                        setSortBy(value);
                     }
                  }}
               >
                  <SelectTrigger
                     aria-label="Sort filmography"
                     className="text-white"
                  >
                     <SelectValue>
                        {t(
                           sortBy === "releaseDate"
                              ? "media.mediaDetails.releaseDate"
                              : "media.mediaDetails.rating",
                        )}
                     </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                     <SelectGroup>
                        <SelectLabel>{t("siteInterface.sortBy")}</SelectLabel>

                        <SelectItem value="releaseDate">
                           {t("media.mediaDetails.releaseDate")}
                        </SelectItem>
                        <SelectItem value="rating">
                           {t("media.mediaDetails.rating")}
                        </SelectItem>
                     </SelectGroup>
                  </SelectContent>
               </Select>
               <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={`Sort ${
                     sortBy === "releaseDate" ? "by release date" : "by rating"
                  } ${sortOrder === "desc" ? "descending" : "ascending"}`}
                  onClick={() =>
                     setSortOrder((order) =>
                        order === "desc" ? "asc" : "desc",
                     )
                  }
               >
                  {sortOrder === "desc" ? (
                     <ArrowDown aria-hidden="true" />
                  ) : (
                     <ArrowUp aria-hidden="true" />
                  )}
               </Button>
            </div>
         </div>

         <ul>
            {sortedMedias.map((item) => (
               <li
                  key={`${item.id} ${item.character} + ${item.job}`}
                  className="group hover:bg-zinc-950 border-t border-0.5 py-5 cursor-pointer"
                  onClick={() => setSelectedItem(item)}
               >
                  <div className="w-full flex items-center gap-3 sm:gap-5 px-2">
                     <span className="shrink-0 text-sm text-gray-400">
                        {formatDate(item.releaseDate, "yearOnly", locale)}
                     </span>

                     <div className="ml-2 sm:ml-10 relative aspect-2/3 w-12 sm:w-15 shrink-0 overflow-hidden bg-zinc-950 cursor-pointer transform transition-all duration-500">
                        <TmdbImage
                           src={item.posterPath}
                           alt={item.title}
                           fill
                           tmdbSize="w300"
                           className="object-cover"
                        />
                     </div>

                     <div className="ml-2 sm:ml-5 flex flex-col gap-1 min-w-0 flex-1">
                        <h3 className="text-sm sm:text-lg truncate">
                           {item.title}
                        </h3>
                        {item.character && (
                           <p className="text-xs sm:text-sm text-gray-400 truncate">
                              As {item.character}
                           </p>
                        )}
                        {item.job && (
                           <p className="text-xs sm:text-sm text-gray-400 truncate">
                              {item.job}
                           </p>
                        )}
                     </div>

                     <div className="flex items-center gap-2 shrink-0">
                        <div className="hidden sm:block">
                           <GenresList
                              genreIds={item.genreIds}
                              isCard={true}
                           />
                        </div>

                        <span className="text-xs sm:text-sm">
                           {item.mediaType}
                        </span>
                        {item.rating > 0 && (
                           <StarRating
                              rating={Number(item.rating.toFixed(1))}
                           />
                        )}
                     </div>
                  </div>
               </li>
            ))}
         </ul>

         {selectedItem && (
            <MediaModal
               mediaId={selectedItem.id}
               mediaType={selectedItem.mediaType}
               onClose={handleCloseModal}
            />
         )}
      </section>
   );
}
