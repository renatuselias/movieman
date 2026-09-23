import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuGroup,
} from "@/shared/ui/dropdown-menu";
import { Globe2, Check } from "lucide-react";
import { routing, languageNames } from "@/app/i18n/routing";
import { useTranslations } from "next-intl";
import { useLanguage } from "@/features/select-language/lib/use-language";

export function LanguageDropdown() {
   const t = useTranslations("menu");
   const { currentLocale, changeLanguage } = useLanguage();

   return (
      <DropdownMenu>
         <DropdownMenuTrigger>
            <div className="flex cursor-pointer flex-col items-center border-t-2 border-black justify-center gap-1 py-1.5">
               <Globe2 size={18} />
               <span className="text-[10px]">{t("language")}</span>
            </div>
         </DropdownMenuTrigger>

         <DropdownMenuContent
            side="top"
            align="center"
            className="mb-2 z-50 bg-black w-fit max-h-[60vh] overflow-y-auto"
         >
            <DropdownMenuGroup>
               <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                  {t("language")}
               </DropdownMenuLabel>
               <DropdownMenuSeparator className="bg-white/5" />

               {routing.locales.map((loc) => (
                  <DropdownMenuItem
                     key={loc}
                     onClick={() => changeLanguage(loc)}
                     className="cursor-pointer flex items-center justify-between gap-4 text-xl"
                  >
                     <span>{languageNames[loc]}</span>
                     {currentLocale === loc && (
                        <Check className="w-3.5 h-3.5 text-zinc-300" />
                     )}
                  </DropdownMenuItem>
               ))}
            </DropdownMenuGroup>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
