"use client";

import { useTranslations } from "next-intl";
import { routing } from "@/app/i18n/routing";
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue,
} from "@/shared/ui/select";
import { Globe } from "lucide-react";
import { languageNames } from "@/app/i18n/routing";
import { useLanguage } from "../lib/use-language";

export function LanguageSelect() {
   const { currentLocale, changeLanguage } = useLanguage();
   const t = useTranslations();

   return (
      <Select
         value={currentLocale}
         onValueChange={changeLanguage}
      >
         <SelectTrigger className="h-6! lg:h-7! px-1 text-[10px] lg:text-xs font-medium cursor-pointer rounded-sm border border-border">
            <SelectValue>
               <div className="flex items-center gap-0.5 font-medium text-zinc-300">
                  <Globe className="h-3! w-3! lg:h-3.5! lg:w-3.5! opacity-70" />
                  <span>{currentLocale.toUpperCase()}</span>
               </div>
            </SelectValue>
         </SelectTrigger>

         <SelectContent
            alignItemWithTrigger={false}
            className="rounded-sm! bg-black"
         >
            <SelectGroup>
               <SelectLabel>{t("menu.language")}</SelectLabel>
               {routing.locales.map((item) => (
                  <SelectItem
                     key={item}
                     value={item}
                     className="cursor-pointer"
                  >
                     {languageNames[item]}
                  </SelectItem>
               ))}
            </SelectGroup>
         </SelectContent>
      </Select>
   );
}
