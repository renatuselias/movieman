import { ArrowUpRight } from "lucide-react";
import { TmdbPersonDetail } from "@/entities/person";
import { useLocale, useTranslations } from "next-intl";
import { formatDate } from "@/shared/lib/format/format-date";
import { Skeleton } from "@/shared/ui/skeleton";
import { Link } from "@/app/i18n/navigation";

interface StatsProps {
   personDetails?: TmdbPersonDetail | null;
   totalCredits: number;
   isLoading: boolean;
}

export function Stats({ personDetails, totalCredits, isLoading }: StatsProps) {
   const currentLocale = useLocale();
   const t = useTranslations("media.cast");

   return (
      <div className="md:col-span-3 lg:col-span-3 space-y-6">
         <div className="space-y-3">
            <span className="block text-xs uppercase tracking-widest text-neutral-500">
               {t("born")}
            </span>
            {isLoading ? (
               <Skeleton className="h-6 w-24" />
            ) : (
               <p className="text-base text-neutral-200">
                  {formatDate(
                     personDetails?.birthday || null,
                     "full",
                     currentLocale,
                  )}
               </p>
            )}
         </div>

         <div className="space-y-3">
            <span className="block text-xs uppercase tracking-widest text-neutral-500">
               {t("birthplace")}
            </span>
            {isLoading ? (
               <Skeleton className="h-6 w-55" />
            ) : (
               <p className="text-base text-neutral-200 leading-snug">
                  {personDetails?.place_of_birth || "—"}
               </p>
            )}
         </div>

         <div className="space-y-3">
            <span className="block text-xs uppercase tracking-widest text-neutral-500">
               {t("credits")}
            </span>
            {isLoading ? (
               <Skeleton className="h-6 w-16" />
            ) : (
               <p className="text-base text-neutral-200">
                  {totalCredits || "—"}
               </p>
            )}
         </div>

         <div className="pt-2">
            <Link
               href={`/person/${personDetails?.id}`}
               className="inline-flex items-center justify-between gap-2 border border-neutral-800 bg-transparent px-3 py-2 text-xs uppercase tracking-widest text-neutral-300 hover:bg-neutral-900 hover:text-white rounded-none transition-colors w-fit"
            >
               <span className="break-all text-left">{t("filmography")}</span>
               <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
            </Link>
         </div>
      </div>
   );
}
