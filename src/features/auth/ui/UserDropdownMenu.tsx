"use client";

import { Link } from "@/app/i18n/navigation";
import { LogOut, Library } from "lucide-react";
import { useAuthActions } from "@/features/auth";
import { useTranslations } from "next-intl";

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

interface UserDropdownMenuProps {
   user: {
      name: string | null;
      email: string | null;
      image?: string | null;
      id: string;
   };
}

export function UserDropdownMenu({ user }: UserDropdownMenuProps) {
   const t = useTranslations("auth");
   const { signOut, loadingType } = useAuthActions();

   const userInitial = user.name
      ? user.name.charAt(0)
      : user.email?.charAt(0) || "U";

   return (
      <DropdownMenu>
         <DropdownMenuTrigger className="relative shrink-0 h-10 w-10 rounded-full border border-white/10 hover:border-white/30 transition-colors focus:outline-none active:scale-95">
            <Avatar className="h-full w-full">
               <AvatarImage
                  src={user.image || undefined}
                  alt={user.name || "User"}
               />
               <AvatarFallback className="bg-zinc-800 text-zinc-400 uppercase">
                  {userInitial}
               </AvatarFallback>
            </Avatar>
         </DropdownMenuTrigger>

         <DropdownMenuContent
            className="w-56 bg-black backdrop-blur-xl border-white/10 text-white rounded-sm"
            align="end"
            sideOffset={8}
         >
            {/* User Info Header */}
            <div className="flex flex-col space-y-1 p-2 px-3">
               <p className="text-sm font-medium text-zinc-200 truncate">
                  {user.name || "User"}
               </p>
               <p className="text-xs text-zinc-500 truncate">
                  {user.email || ""}
               </p>
            </div>

            <DropdownMenuSeparator className="bg-white/5" />

            {/* Menu Items */}
            <DropdownMenuGroup className="p-1 text-zinc-400">
               <DropdownMenuItem>
                  <Link
                     href="/library"
                     className="flex cursor-pointer items-center gap-3 px-1 py-1.5 w-full"
                  >
                     <Library className="w-4 h-4 text-zinc-500" />
                     <span>{t("library")}</span>
                  </Link>
               </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-white/5" />

            <div className="p-1">
               <DropdownMenuItem
                  disabled={loadingType === "logout"}
                  onClick={signOut}
                  className="flex cursor-pointer items-center gap-3 px-3 py-2.5 text-red-500/80 hover:text-red-500 hover:bg-red-500/10  "
               >
                  <LogOut className="w-4 h-4" />
                  <span>{t("logout")}</span>
               </DropdownMenuItem>
            </div>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
