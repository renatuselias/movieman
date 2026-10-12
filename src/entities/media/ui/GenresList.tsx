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

   const genres = validGenres.slice(0, isCard ? 2 : validGenres.length);

   return (
      <div className={`truncate min-w-0 text-sm flex flex-wrap`}>
         {genres.map((genre, index) => {
            const isLast = index === genres.length - 1;
            return (
               <span
                  key={genre.id}
                  className="inline text-wrap"
               >
                  {!isCard ? (
                     <Link
                        href={`/genre/${genre.id}`}
                        className="text-zinc-400 underline hover:text-white transition-colors"
                     >
                        {t(`genres.${genre.key}`)}
                     </Link>
                  ) : (
                     <span className="text-zinc-500 text-xs">
                        {t(`genres.${genre.key}`)}
                     </span>
                  )}
                  {!isLast && (
                     <span className="mr-1 text-sm text-zinc-500">
                        {`${isCard ? " / " : ","}`}{" "}
                     </span>
                  )}
               </span>
            );
         })}
      </div>
   );
}
