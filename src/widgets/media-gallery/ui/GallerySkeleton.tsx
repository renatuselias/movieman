import { Skeleton } from "@/shared/ui/skeleton";

export function GallerySkeleton() {
   return (
      <div className="space-y-5">
         <div className="flex flex-col gap-4">
            <Skeleton className="w-40 h-4" />
            <Skeleton className="w-70 h-8" />
         </div>
         <div className="max-w-120 flex gap-4">
            <Skeleton className="w-1/3 h-8" />
            <Skeleton className="w-1/3 h-8" />
            <Skeleton className="w-1/3 h-8" />
         </div>
         <div className="flex">
            <Skeleton className="w-1/3 h-70" />
            <Skeleton className="w-1/3 h-70" />
            <Skeleton className="w-1/3 h-70" />
         </div>
      </div>
   );
}
