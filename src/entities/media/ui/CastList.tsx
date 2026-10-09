import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { HeaderInfo } from "../model/types";
import { Link } from "@/app/i18n/navigation";
import { useTranslations } from "next-intl";

interface CastListProps {
   cast: HeaderInfo["cast"];
   textList: boolean;
   avatarSize?: number;
   mediaType?: "movie" | "tv";
   mediaId?: number;
}

export function CastList({
   cast,
   textList = false,
   avatarSize = 8,
   mediaType,
   mediaId,
}: CastListProps) {
   const t = useTranslations();

   return (
      <div className="flex gap-2 items-center">
         <ul
            className={`flex ${textList ? "gap-1 sm:gap-2 flex-wrap" : "-space-x-2"}`}
         >
            {cast &&
               cast.length > 0 &&
               cast.slice(0, 5).map((member, index) => {
                  const isLast = index === Math.min(cast.length, 5) - 1;

                  return (
                     <li
                        key={member.id}
                        className="inline-flex items-center"
                     >
                        <Link
                           href={`/person/${member.id}`}
                           className="flex gap-1.5 items-center transition-all duration-300 hover:scale-105 hover:z-10 relative"
                           title={`${member.name}${member.character ? ` as ${member.character}` : ""}`}
                        >
                           <Avatar
                              className={`${textList ? "hidden sm:block" : ""} border border-background shrink-0`}
                              style={{
                                 width: `${avatarSize * 4}px`,
                                 height: `${avatarSize * 4}px`,
                              }}
                           >
                              {member.profilePath && (
                                 <AvatarImage
                                    src={`https://image.tmdb.org/t/p/w185${member.profilePath}`}
                                    alt={member.name}
                                    className="object-cover"
                                 />
                              )}
                              <AvatarFallback className="bg-zinc-800 text-[10px] font-medium text-zinc-300">
                                 {member.name.charAt(0)}
                              </AvatarFallback>
                           </Avatar>

                           {textList && (
                              <span className="text-sm text-zinc-300">
                                 {member.name}
                                 {textList && !isLast && (
                                    <span className="inline sm:hidden">,</span>
                                 )}
                              </span>
                           )}
                        </Link>
                     </li>
                  );
               })}
         </ul>
         {!textList && (
            <Link
               href={`/${mediaType}/${mediaId}`}
               className="bg-none! font-heading tracking-tight font-medium text-sm text-zinc-500 hover:text-zinc-300 transform transition-all duration-300"
            >
               {t("media.headerInfo.fullCast")}
            </Link>
         )}
      </div>
   );
}
