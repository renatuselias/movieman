"use client";

import { Link } from "@/app/i18n/navigation";
import { NAV_ITEMS } from "@/shared/config/navigation";
import { useTranslations } from "next-intl";
import { usePathname } from "@/app/i18n/navigation";

export function HeaderNav() {
   const t = useTranslations("menu");
   const pathname = usePathname();

   return (
      <ul className="hidden sm:flex flex-wrap gap-4 text-base font-normal tracking-wider select-none ">
         {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
               <li key={item.href}>
                  <Link
                     href={item.href}
                     className={`transition-colors hover:text-foreground
                  ${isActive ? "text-white border-white!" : "text-muted-foreground"}`}
                  >
                     {t(item.translationKey)}
                  </Link>
               </li>
            );
         })}
      </ul>
   );
}
