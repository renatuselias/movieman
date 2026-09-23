"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/app/i18n/navigation";

export function useLanguage() {
   const locale = useLocale();
   const pathname = usePathname();
   const router = useRouter();

   const changeLanguage = (nextLocale: string | null) => {
      if (!nextLocale) return;
      router.replace(pathname, { locale: nextLocale });
   };

   return {
      currentLocale: locale,
      changeLanguage,
   };
}
