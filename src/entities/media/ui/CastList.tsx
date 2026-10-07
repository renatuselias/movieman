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
      <div>
         {textList ? (
            <ul className="flex">
               {cast &&
                  cast.length > 0 &&
                  cast.slice(0, 5).map((member) => (
                     <li
                        key={member.id}
                        className="text-sm"
                     >
                        {member.name}
                     </li>
                  ))}
            </ul>
         ) : (
            <div className="flex gap-2 items-center">
               <ul className="flex -space-x-2">
                  {cast &&
                     cast.length > 0 &&
                     cast.slice(0, 5).map((member) => (
                        <li key={member.id}>
                           {/* {member.name} as {member.character} */}
                           {member.profilePath && (
                              <Link
                                 href={`/person/${member.id}`}
                                 className="block transition-all duration-700 hover:scale-110 hover:z-10 relative"
                                 title={member.name}
                              >
                                 <Avatar
                                    className={`h-${avatarSize} w-${avatarSize} border border-background shrink-0`}
                                 >
                                    <AvatarImage
                                       src={`https://image.tmdb.org/t/p/w92${member.profilePath}`}
                                       alt={member.name}
                                       className="object-cover"
                                    />
                                    <AvatarFallback className="bg-zinc-800 text-[10px] font-medium text-zinc-300">
                                       {member.name.charAt(0)}
                                    </AvatarFallback>
                                 </Avatar>
                              </Link>
                           )}
                        </li>
                     ))}
               </ul>
               <Link
                  href={`/${mediaType}/${mediaId}`}
                  className="bg-none! font-medium text-sm hover:text-zinc-500 transform transition-all duration-300"
               >
                  {t("media.headerInfo.fullCast")}
               </Link>
            </div>
         )}
      </div>
   );
}
