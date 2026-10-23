"use client";

import { useState } from "react";
import { Link } from "@/app/i18n/navigation";
import { BaseCreditMember } from "@/entities/media";
import { useTranslations } from "next-intl";

export const PersonDetailItem = ({
   title,
   items,
}: {
   title: string;
   items: BaseCreditMember | BaseCreditMember[];
}) => {
   const t = useTranslations("siteInterface");
   const [isExpanded, setIsExpanded] = useState(false);

   if (!items) return null;
   const itemsArray = Array.isArray(items) ? items : [items];
   if (itemsArray.length === 0) return null;

   const VISIBLE_COUNT = 3;
   const hasMore = itemsArray.length > VISIBLE_COUNT;

   return (
      <div className="flex flex-col gap-2 pb-5 border-b border-zinc-800">
         <h4 className="uppercase text-[10px] text-zinc-500 tracking-wider">
            {title}
         </h4>

         <div className="text-zinc-300 flex flex-wrap items-center gap-y-1">
            {itemsArray.map((item, index) => {
               const isHidden = !isExpanded && index >= VISIBLE_COUNT;

               return (
                  <span
                     key={item.id}
                     className={`inline-flex items-center transition-opacity duration-300 ease-in-out ${
                        isHidden
                           ? "opacity-0 w-0 h-0 overflow-hidden m-0 p-0 pointer-events-none select-none"
                           : "opacity-100"
                     }`}
                  >
                     <Link
                        href={`/person/${item.id}`}
                        className="hover:text-white transition-colors"
                     >
                        {item.name}
                     </Link>

                     {index < itemsArray.length - 1 &&
                        !(index === VISIBLE_COUNT - 1 && !isExpanded) && (
                           <span className="text-zinc-500 mx-1.5">/</span>
                        )}
                  </span>
               );
            })}

            {hasMore && (
               <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="ml-2 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-2 cursor-pointer focus:outline-none"
               >
                  {isExpanded
                     ? t("showLess")
                     : `${t("more")} +${itemsArray.length - VISIBLE_COUNT}`}
               </button>
            )}
         </div>
      </div>
   );
};
