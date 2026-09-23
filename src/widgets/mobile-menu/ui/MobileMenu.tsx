"use client";

import { Link } from "@/app/i18n/navigation";
import { usePathname } from "@/app/i18n/navigation";
import { ChevronUp, ChevronDown } from "lucide-react";

import { useTranslations } from "next-intl";
import { NAV_ITEMS } from "@/shared/config/navigation";
import { Dispatch, SetStateAction } from "react";
import { LanguageDropdown } from "@/features/select-language";

export function MobileMenu({
   isOpen,
   setIsOpen,
}: {
   isOpen: boolean;
   setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
   const pathname = usePathname();
   const t = useTranslations("menu");

   return (
      <div
         className={`fixed sm:hidden bottom-0 left-0 right-0 z-50 transition-transform duration-500 ease-in-out ${
            isOpen ? "translate-y-0" : "translate-y-[calc(100%-1.55rem)]"
         }`}
      >
         <div className="flex justify-end px-4">
            <button
               onClick={() => setIsOpen((prev) => !prev)}
               className="flex items-center justify-center rounded-t-sm border-x border-t border-border bg-black px-3 py-1 text-muted-foreground transition-colors hover:text-white"
            >
               {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
               ) : (
                  <ChevronUp className="h-4 w-4" />
               )}
            </button>
         </div>

         <nav className="border-t border-border bg-black px-2">
            <ul className="flex items-center justify-around">
               {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                     <li key={item.href}>
                        <Link
                           href={item.href}
                           className={`flex w-fit border-t-2 border-transparent h-auto flex-col items-center gap-1 py-1.5 transition-colors hover:text-foreground
                           ${isActive ? "text-white border-white!" : "text-muted-foreground"}`}
                        >
                           <Icon size={18} />
                           <span className="text-[10px]">
                              {t(item.translationKey)}
                           </span>
                        </Link>
                     </li>
                  );
               })}

               <li>
                  <LanguageDropdown />
               </li>
            </ul>
         </nav>
      </div>
   );
}
