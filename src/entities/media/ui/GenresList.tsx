import { Link } from "@/app/i18n/navigation";
import { ALL_GENRES } from "@/shared/config/tmdb-genres";
import { useTranslations } from "next-intl";

interface MediaGenresListProps {
   genreIds: number[];
   isCard?: boolean;
}

export function GenresList({
   genreIds = [],
   isCard = false,
}: MediaGenresListProps) {
   const t = useTranslations();

   const validGenres = genreIds
      .map((id) => ({ id, key: ALL_GENRES[id] }))
      .filter((g): g is { id: number; key: string } => Boolean(g.key));

   if (!validGenres.length) return null;

   return (
      <div className="truncate min-w-0 text-sm text-muted-foreground flex flex-wrap">
         {validGenres.map((genre, index) => {
            const isLast = index === validGenres.length - 1;
            return (
               <span
                  key={genre.id}
                  className="inline"
               >
                  {!isCard ? (
                     <Link
                        href={`/genre/${genre.id}`}
                        className="hover:underline hover:text-white transition-colors"
                     >
                        {t(`genres.${genre.key}`)}
                     </Link>
                  ) : (
                     <span> {t(`genres.${genre.key}`)}</span>
                  )}
                  {!isLast && <span className="mr-1">,</span>}
               </span>
            );
         })}
      </div>
   );
}
