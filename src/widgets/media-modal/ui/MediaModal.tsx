"use client";

import { useRef } from "react";
import { HeaderInfo, useGetExtras } from "@/entities/media";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent } from "@/shared/ui/dialog";

interface MediaModalProps {
   mediaId: number;
   mediaType: "movie" | "tv";
   onClose: () => void;
}

export function MediaModal({ mediaId, mediaType, onClose }: MediaModalProps) {
   const t = useTranslations("mediaDetail");

   const contentRef = useRef<HTMLDivElement>(null);

   const { data: extraMedia, isLoading } = useGetExtras(
      mediaId,
      mediaType,
      false,
   );

   console.log(extraMedia);

   return (
      <Dialog
         open={true}
         onOpenChange={(open) => !open && onClose()}
      >
         <DialogContent
            ref={contentRef}
            tabIndex={-1}
            style={{ border: "none", boxShadow: "none", outline: "none" }}
            className="fixed top-1/2 left-1/2! -translate-x-1/2! -translate-y-1/2! w-[90vw]! max-w-[90vw]! lg:w-240! lg:max-w-240! max-h-[90dvh] overflow-y-auto bg-black! border-0! shadow-none! ring-0! outline-none! focus:outline-none! focus-visible:outline-none! rounded-none! px-0! py-0! pb-10! sm:pb-20!"
         >
            <div className="flex flex-col relative w-full bg-black">
               {(extraMedia as HeaderInfo).logoPath}
            </div>
         </DialogContent>
      </Dialog>
   );
}
