"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/shared/ui/dialog";
import { useTranslations } from "next-intl";
import { AuthTabs } from "./AuthTabs";

export function AuthModal() {
   const t = useTranslations("auth");
   const [open, setOpen] = useState(false);

   return (
      <Dialog
         open={open}
         onOpenChange={setOpen}
      >
         <DialogTrigger
            className="border tracking-widest rounded-sm py-1! px-1.5
         cursor-pointer transition-colors! text-base md:text-lg
         bg-linear-to-r from-zinc-100 via-zinc-400 to-zinc-600 bg-clip-text text-transparent animate-shimmer"
         >
            {t("signIn")}
         </DialogTrigger>

         <DialogContent className="overflow-y-auto max-h-[80vh] bg-black! border-none!">
            <AuthTabs onSuccess={() => setOpen(false)} />
         </DialogContent>
      </Dialog>
   );
}
