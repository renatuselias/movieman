import { Link } from "@/app/i18n/navigation";
import { Skeleton } from "@/shared/ui/skeleton";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface BiographyProps {
   biography?: string;
   isLoading: boolean;
   personId?: number;
}

export function Biography({ biography, personId, isLoading }: BiographyProps) {
   const t = useTranslations("media");
   return (
      <div className="md:col-span-5 lg:col-span-6 space-y-3">
         <span className="block text-xs uppercase tracking-widest text-neutral-500">
            {t("cast.biography")}
         </span>

         {isLoading ? (
            <div className="space-y-2.5 pt-1">
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-[95%]" />
               <Skeleton className="h-4 w-[90%]" />
               <Skeleton className="h-4 w-[60%]" />
            </div>
         ) : (
            <div className="space-y-3">
               <p
                  className="text-base leading-relaxed tracking-tighter text-neutral-300 font-normal overflow-hidden text-ellipsis display-webkit-box"
                  style={{
                     WebkitLineClamp: 8,
                     WebkitBoxOrient: "vertical",
                     display: "-webkit-box",
                  }}
               >
                  {biography || (
                     <span className="text-neutral-500 italic">
                        {t("cast.noBiography")}
                     </span>
                  )}
               </p>

               {biography && personId && (
                  <Link
                     className="px-0! py-0! h-fit! rounded-none! bg-transparent! cursor-pointer group/link flex w-fit items-center gap-1 font-manrope text-md text-white/70 underline underline-offset-4 decoration-white/30 transition-colors hover:text-white hover:decoration-white/60"
                     href={`/person/${personId}`}
                  >
                     {t("mediaDetails.details")}
                     <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                  </Link>
               )}
            </div>
         )}
      </div>
   );
}
