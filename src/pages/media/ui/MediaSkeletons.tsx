import { Skeleton } from "@/shared/ui/skeleton";

export function SynopsisSkeleton() {
   return (
      <>
         <div className="flex flex-col gap-4">
            <Skeleton className="w-40 h-4" />
            <Skeleton className="w-70 h-8" />
         </div>
         <div className="flex flex-col gap-2 w-full md:w-5/9 min-w-0">
            <Skeleton className="w-50 h-4 mb-5" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
         </div>
      </>
   );
}

export function DetailsSkeleton() {
   return (
      <div className="w-full flex gap-5 sm:gap-10 md:gap-20 flex-wrap md:flex-nowrap justify-between items-start">
         <div className="flex flex-col gap-4">
            <Skeleton className="w-40 h-4" />
            <Skeleton className="w-70 h-8" />
         </div>
         <div className="flex flex-col gap-4 w-full md:w-6/9 min-w-0">
            <div className="grid grid-cols-2 gap-x-8 sm:gap-x-12 gap-y-6">
               {Array.from({ length: 10 }).map((_, i) => (
                  <div
                     key={i}
                     className="flex flex-col gap-3 border-b pb-5"
                  >
                     <Skeleton className="w-20 h-4" />
                     <Skeleton className="w-4/5 h-5" />
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}
