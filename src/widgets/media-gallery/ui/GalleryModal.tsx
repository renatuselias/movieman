import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { TmdbImage } from "@/shared/ui/TmdbImage";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { MediaVideo } from "./MediaGallery";

interface GalleryModalProps {
   selectedMedia: string | MediaVideo | undefined;
   activeTab: "backdrops" | "posters" | "videos";
   selectedIndex: number | null;
   setSelectedIndex: Dispatch<SetStateAction<number | null>>;
   videos: MediaVideo[];
   currentItems: MediaVideo[] | string[];
   navigateMedia: (direction: 1 | -1) => void;
}

export function GalleryModal({
   selectedMedia,
   activeTab,
   selectedIndex,
   setSelectedIndex,
   videos,
   currentItems,
   navigateMedia,
}: GalleryModalProps) {
   return (
      <Dialog
         open={selectedIndex !== null}
         onOpenChange={(open) => {
            if (!open) setSelectedIndex(null);
         }}
      >
         <DialogContent
            showCloseButton={false}
            className={`gap-0! overflow-hidden! rounded-xs! border-0! bg-black! p-0! ring-0! ${
               activeTab === "posters"
                  ? "h-[min(82dvh,850px)]! w-auto! max-w-[92vw]! aspect-2/3!"
                  : "w-[min(94vw,72rem)]! max-w-none! aspect-video! max-h-[82dvh]!"
            }`}
         >
            <div className="relative flex h-full w-full items-center justify-center bg-zinc-950">
               {typeof selectedMedia === "string" && (
                  <div className="absolute inset-0">
                     <TmdbImage
                        src={selectedMedia}
                        alt={`${activeTab === "posters" ? "Poster" : "Backdrop"} ${(selectedIndex ?? 0) + 1}`}
                        fill
                        sizes="100vw"
                        className="object-contain!"
                     />
                  </div>
               )}
               {activeTab === "videos" &&
                  selectedIndex !== null &&
                  videos[selectedIndex] && (
                     <iframe
                        src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videos[selectedIndex].key)}?autoplay=1&rel=0`}
                        title={videos[selectedIndex].name}
                        allow="autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                        className="aspect-video h-full max-h-[82dvh] w-full object-contain"
                     />
                  )}
               <button
                  type="button"
                  onClick={() => setSelectedIndex(null)}
                  className="absolute right-2 top-2 z-20 rounded-sm bg-black/70 p-1 text-white transition-colors hover:bg-white/20 sm:right-3 sm:top-3"
               >
                  <X className="h-6 w-6" />
               </button>
               {currentItems.length > 1 && (
                  <>
                     <button
                        type="button"
                        onClick={(event) => {
                           event.preventDefault();
                           event.stopPropagation();
                           navigateMedia(-1);
                        }}
                        className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-sm bg-black/70 p-1 text-white transition-colors hover:bg-white/20 sm:left-3 sm:p-3"
                     >
                        <ChevronLeft className="h-7 w-7" />
                     </button>
                     <button
                        type="button"
                        onClick={(event) => {
                           event.preventDefault();
                           event.stopPropagation();
                           navigateMedia(1);
                        }}
                        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-sm bg-black/70 p-1 text-white transition-colors hover:bg-white/20 sm:right-3 sm:p-3"
                     >
                        <ChevronRight className="h-7 w-7" />
                     </button>
                     <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-xs bg-black/60 px-2 py-1 text-sm text-white">
                        {(selectedIndex ?? 0) + 1} / {currentItems.length}
                     </div>
                  </>
               )}
            </div>
         </DialogContent>
      </Dialog>
   );
}
